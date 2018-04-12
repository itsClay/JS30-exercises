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
  link.innerHTML = `<img src="${data}" alt="" />`
  strip.insertBefore(link, strip.firstChild)
}

getVideo()

video.addEventListener('canplay', paintToCanvas)