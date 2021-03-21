let videoElement;
let canvas;

function startMediaStream(videoElement) {
  navigator.mediaDevices
    .getUserMedia({
      video: true,
      audio: {
        echoCancellation: true,
        noiseSuppression: true,
      },
    })
    .then((media) => {
      videoElement.srcObject = media;
      videoElement.play();
      loadBodyPix();
    })
    .catch((err) => {
      alert("There has been an error use a better browser fool: " + err);
    });
}

function stopMediaStream() {
  const media = videoElement.srcObject;
  stopMediaStream.getTracks().forEach((track) => track.stop());
  videoElement.srcObject = null;
}

function loadBodyPix() {
  console.log("bodyPix loaded");
  bodyPix
    .load({
      architecture: "ResNet50",
      outputStride: 32,
      quantBytes: 2,
    })
    .then((net) => apply(net));
}

async function apply(net) {
  let segmentation = await net.segmentPerson(videoElement, {
    internalResolution: "medium",
    segementationThreshold: 0.5,
  });

  console.log(segmentation);

  // const maskBackground = true;
  // // Convert the segmentation into a mask to darken the background.
  // const foregroundColor = { r: 0, g: 0, b: 0, a: 0 };
  // const backgroundColor = { r: 0, g: 0, b: 0, a: 255 };
  // const backgroundDarkeningMask = bodyPix.toMask(
  //   segmentation,
  //   foregroundColor,
  //   backgroundColor
  // );

  // const opacity = 0.7;
  // // const edgeBlur = 3;
  // const maskBlurAmount = 3;
  // const flipHorizontal = false;
  // bodyPix.drawMask(
  //   canvas,
  //   videoElement,
  //   backgroundDarkeningMask,
  //   opacity,
  //   maskBlurAmount,
  //   flipHorizontal
  // );
}

document.addEventListener("DOMContentLoaded", () => {
  videoElement = document.querySelector("#video");
  canvas = document.querySelector("#canvas");
  startMediaStream(videoElement);
});
