import Camera from "./camera.js";
import HandsController, { hands } from "./hands.js";

const cameralement = document.getElementById("webcam");
const videoDivElement = document.getElementById("video-div");
const canvasElement = document.getElementById("canvas");
const dashboardCanvasElement = document.getElementById("dashboard-canvas");
const snapSoundElement = document.getElementById("snapSound");
const ratio = {
  h: 9,
  w: 16,
};

const resizeHandler = () => {
  const ratio = { h: window.videoHeight, w: videoWidth };

  let widthResult = window.innerWidth > 900 ? 900 : window.innerWidth;
  let heightResult = Math.floor(widthResult * (ratio.h / ratio.w));
  if (heightResult > window.innerHeight) {
    heightResult = window.innerHeight;
    widthResult = Math.floor(heightResult * (ratio.w / ratio.h));
  }

  const sixtyWidth = parseInt(widthResult * 0.4);
  const sixtyHeight = parseInt(heightResult * 0.4);
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
      element.style.width = `${widthResult}px`;
      element.style.height = `${heightResult}px`;
    }
  }
};

function draw() {
  const ctx = dashboardCanvasElement.getContext("2d");
  // var randomColor = "#" + Math.floor(Math.random() * 16777215).toString(16);
  // ctx.fillStyle = randomColor;
  ctx.fillStyle = "rgba(0, 0, 0, 0)";
  ctx.clearRect(
    0,
    0,
    dashboardCanvasElement.width,
    dashboardCanvasElement.height
  );
  drawCircle(dashboardCanvasElement, ctx);

  drawEmojiOnCanvas(dashboardCanvasElement, ctx);
  // requestAnimationFrame(draw);
}

function drawCircle(canvas, context) {
  var centerX = canvas.width / 6;
  var centerY = canvas.height / 4;
  var radius = 0.1 * canvas.width;

  context.beginPath();
  context.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);
  context.fillStyle = "#4b9fc9";
  context.fill();
}

function drawEmojiOnCanvas(canvas, contex) {
  contex.font = `${parseInt(parseInt(12 * canvas.width) / 100)}px serif`;
  contex.textAlign = "center";
  contex.fillStyle = "black";
  contex.textBaseline = "middle";
  contex.fillText("\u{1F91A}", canvas.width / 6, canvas.height / 4);
}

window.addEventListener("resize", () => {
  resizeHandler();
});

(async () => {
  const camera = new Camera(
    cameralement,
    "user",
    canvasElement,
    snapSoundElement
  );
  const [width, height] = await camera.getWebcamResolution();
  window.videoWidth = width;
  window.videoHeight = height;
  resizeHandler();
  const handsController = new HandsController(
    cameralement,
    canvasElement,
    dashboardCanvasElement
  );
  await handsController.init();
  handsController.onFrame();
})();
