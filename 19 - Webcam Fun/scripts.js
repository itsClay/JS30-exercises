const video = document.querySelector('.player');
const canvas = document.querySelector('.photo');
const ctx = canvas.getContext('2d');
const strip = document.querySelector('.strip');
const snap = document.querySelector('.snap');

function getVideo() {
  navigator.mediaDevices.getUserMedia({video: true, audio:false})
    .then(localMediaStream => {
      console.log(localMediaStream)
      try {
        video.srcObject = localMediaStream
      } catch (err) {
        console.error(err)
        video.src = window.URL.createObjectURL(localMediaStream)
      }
      video.play()
    })
    .catch(e => {
      console.error('hmm somethings not right', e)
    })
}

function paintToCanvas() {
  const width = video.videoWidth
  const height = video.videoHeight
  // console.log(width, height)
  canvas.height = height
  canvas.width = width

  setInterval(() => {
    ctx.drawImage(video, 0, 0, width, height)
    // take pixels out
    let pixels = ctx.getImageData(0, 0, width, height)
    // update pixels color

    // Red Effect
    // pixels = redEffect(pixels)
    // 3D glasses effect
    // pixels = rgbSplit(pixels)
    // Ghost Effect
    // ctx.globalAlpha = 0.1
    // Green Screen Effect
    pixels = greenScreen(pixels)

    ctx.putImageData(pixels, 0, 0)
  }, 16)
}

function takePhoto() {
  // play sound
  snap.currentTime = 0
  snap.play()

  // take data out of the canvas and generate a downloadable link
  const data = canvas.toDataURL('image/jpeg')
  console.log(data)
  const link = document.createElement('a')
  link.href = data
  link.setAttribute('download', 'handsome')
  link.innerHTML = `<img src="${data}" alt="Handsome" />`
  strip.insertBefore(link, strip.firstChild)
}

function redEffect(pixels) {
  for( let i = 0; i < pixels.data.length; i += 4 ) {
    pixels.data[i] = pixels.data[i] + 100 // RED 
    pixels.data[i + 1] = pixels.data[i + 1] - 50 // GREEN
    pixels.data[i + 2] = pixels.data[i + 2] * 0.5 // BLUE
    pixels.data[i + 3] // alpha
  }
  return pixels;
}

function rgbSplit(pixels) {
  for (let i = 0; i < pixels.data.length; i += 4) {
    pixels.data[i] = pixels.data[i] // RED 
    pixels.data[i - 150] = pixels.data[i + 1] // GREEN
    pixels.data[i + 100] = pixels.data[i + 2] // BLUE
    pixels.data[i - 150] // alpha
  }
  return pixels;
}

function greenScreen(pixels) {
  // hold min and max greens
  const levels = {};

  document.querySelectorAll('.rgb input').forEach((input) => {
    levels[input.name] = input.value; 
  })
  console.log('levels', levels);

  for (let i = 0; i < pixels.data.length; i += 4) {
    let red = pixels.data[i]
    let green = pixels.data[i + 1]
    let blue = pixels.data[i + 2]
    let alpha = pixels.data[i + 3]

    if( 
      red >= levels.rmin &&
      green >= levels.gmin &&
      blue >= levels.bmin &&
      red <= levels.rmax &&
      green <= levels.gmax &&
      blue <= levels.bmax 
    ) {
      // take it out - set alpha to 0
      pixels.data[i + 3] = 0
    }
  }

  return pixels
}

getVideo()

video.addEventListener('canplay', paintToCanvas)