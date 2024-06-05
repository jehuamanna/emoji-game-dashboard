import Camera from "./camera.js";

const cameralement = document.getElementById("webcam");
const videoDivElement = document.getElementById("video-div");
const canvasElement = document.getElementById("canvas");
const dashboardCanvasElement = document.getElementById("dashboard-canvas");
const snapSoundElement = document.getElementById("snapSound");
const ratio = {
  h: 9,
  w: 16,
};

const resizeHandler = (width, height) => {
  const ratio = { h: window.videoHeight, w: videoWidth };

  let widthResult = window.innerWidth > 900 ? 900 : window.innerWidth;
  let heightResult = Math.floor(widthResult * (ratio.h / ratio.w));
  if (heightResult > window.innerHeight) {
    heightResult = window.innerHeight;
    widthResult = Math.floor(heightResult * (ratio.w / ratio.h));
  }

  const sixtyWidth = parseInt(widthResult * 0.6);
  const sixtyHeight = parseInt(heightResult * 0.6);
  // let widthVideoResult = window.innerWidth > 640 ? 640 : window.innerWidth;
  let widthVideoResult = sixtyWidth;
  let heightVideoResult = Math.floor(widthVideoResult * (ratio.h / ratio.w));
  if (heightVideoResult > sixtyHeight) {
    heightVideoResult = 480;
    widthVideoResult = Math.floor(heightVideoResult * (ratio.w / ratio.h));
  }
  console.log(widthResult, heightResult);
  console.log(widthVideoResult, heightVideoResult);

  videoDivElement.setAttribute(
    "style",
    `position: relative; width:${widthResult}px;height:${heightResult}px`
  );

  for (let i = 0; i < videoDivElement.children.length; i += 1) {
    const element = videoDivElement.children[i];
    if (element.tagName === "CANVAS") {
      // console.log(widthResult, heightResult);
      element.width = widthResult;
      element.height = heightResult;
    } else {
      element.style.width = `${widthVideoResult}px`;
      element.style.height = `${heightVideoResult}px`;
    }
  }
  draw(widthResult, heightResult);
};

function draw(widthResult, heightResult) {
  const ctx = dashboardCanvasElement.getContext("2d");
  // ctx.width = cameralement.videoWidth;
  // ctx.height = cameralement.videoHeight;

  // videoDivElement.width = cameralement.videoWidth;
  // videoDivElement.height = cameralement.videoHeight;
  // var randomColor = "#" + Math.floor(Math.random() * 16777215).toString(16);
  // ctx.fillStyle = randomColor;
  ctx.fillStyle = "#2A8282";
  ctx.clearRect(
    0,
    0,
    dashboardCanvasElement.width,
    dashboardCanvasElement.height
  );

  ctx.fillRect(0, 0, widthResult, heightResult);
  drawEmojiOnCanvas(dashboardCanvasElement, ctx);
}

function drawEmojiOnCanvas(canvas, contex) {
  contex.font = `${parseInt(parseInt(12 * canvas.width) / 100)}px serif`;
  contex.textAlign = "center";
  contex.textBaseline = "middle";
  contex.fillText("\u{1F91A}", canvas.width / 6, canvas.height / 2);
}

window.addEventListener("resize", () => {
  resizeHandler();
});

document.addEventListener("DOMContentLoaded", function () {
  (async () => {
    const camera = new Camera(
      cameralement,
      "user",
      canvasElement,
      snapSoundElement
    );
    let videoWidth;
    let videoHeight;
    const resolution = await camera.start();
    console.log("rrr", resolution);

    // cameralement.addEventListener("onloadedmetadata", function () {
    //   const width = cameralement.videoWidth;
    //   const height = cameralement.videoHeight;
    //   console.log(`Resolution: ${width} x ${height}`);
    // });

    cameralement.onloadedmetadata = function () {
      const width = cameralement.videoWidth;
      const height = cameralement.videoHeight;
      window.videoWidth = width;
      window.videoHeight = height;
      console.log(`Resolution: ${width} x ${height}`);
      resizeHandler(width, height);
    };

    /*
      
      video: {
        optional: [
          {minWidth: 320},
          {minWidth: 640}, 480
          {minWidth: 1024},
          {minWidth: 1280},
          {minWidth: 1920},
          {minWidth: 2560},
        ]
      }
      
      */
  })();
});
