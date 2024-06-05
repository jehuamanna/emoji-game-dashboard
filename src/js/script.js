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

const camera = new Camera(
  cameralement,
  "user",
  canvasElement,
  snapSoundElement
);

const resizeHandler = () => {
  let widthResult = window.innerWidth > 900 ? 900 : window.innerWidth;
  let heightResult = Math.floor(widthResult * (ratio.h / ratio.w));
  if (heightResult > window.innerHeight) {
    heightResult = window.innerHeight;
    widthResult = Math.floor(heightResult * (ratio.w / ratio.h));
  }

  let widthVideoResult = window.innerWidth > 356 ? 356 : window.innerWidth;
  let heightVideoResult = Math.floor(widthVideoResult * (ratio.h / ratio.w));
  if (heightVideoResult > 200) {
    heightVideoResult = 200;
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
    console.log(element.tagName);
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

// First run to auto adjust screen
resizeHandler();

window.addEventListener("resize", () => {
  resizeHandler();
});

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
  console.log("ee", widthResult, heightResult);

  ctx.fillRect(0, 0, widthResult, heightResult);
  drawEmojiOnCanvas(dashboardCanvasElement, ctx);
}

(async () => {
  camera.start().then(() => {});
})();

function drawEmojiOnCanvas(canvas, contex) {
  contex.font = `${parseInt(parseInt(12 * canvas.width) / 100)}px serif`;
  // use these alignment properties for "better" positioning
  contex.textAlign = "center";
  contex.textBaseline = "middle";
  // draw the emoji
  contex.fillText("\u{1F91A}", canvas.width / 4, canvas.height / 2);
}

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
