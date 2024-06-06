import { Hands, HAND_CONNECTIONS } from "@mediapipe/hands";
import { drawConnectors, lerp, drawLandmarks } from "@mediapipe/drawing_utils";
const config = {
  locateFile: (file) => {
    return `/assets/models-assets/${file}`;
  },
};

export default class HandsController {
  constructor(video, canvas, canvasDB) {
    this.video = video;
    this.canvas = canvas;
    this.canvasCtx = canvas.getContext("2d");
    this.canvasDB = canvasDB;
    this.canvasDBCtx = canvasDB.getContext("2d");
    this.onResults = this.onResults.bind(this);
    this.onResults = this.onResults.bind(this);
    const hands = new Hands(config);
    this.hands = hands;
  }
  async init() {
    await this.hands.initialize();
    this.hands.setOptions({
      selfieMode: true,
      maxNumHands: 2,
      modelComplexity: 0,
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5,
    });
    this.hands.onResults(this.onResults);
    this.onFrame();
  }

  async onFrame() {
    await this.hands.send({ image: this.video });
    requestAnimationFrame(this.onFrame.bind(this));
  }
  drawCircle() {
    var centerX = this.canvasDB.width / 6;
    var centerY = this.canvasDB.height / 4;
    var radius = 0.1 * this.canvasDB.width;

    this.canvasDBCtx.beginPath();
    this.canvasDBCtx.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);
    this.canvasDBCtx.fillStyle = "#4b9fc9";
    this.canvasDBCtx.fill();
    this.drawEmojiOnCanvas();
  }

  drawEmojiOnCanvas() {
    this.canvasDBCtx.font = `${parseInt(
      parseInt(12 * this.canvasDB.width) / 100
    )}px serif`;
    this.canvasDBCtx.textAlign = "center";
    this.canvasDBCtx.fillStyle = "black";
    this.canvasDBCtx.textBaseline = "middle";
    this.canvasDBCtx.fillText(
      "\u{1F91A}",
      this.canvasDB.width / 6,
      this.canvasDB.height / 4
    );
  }

  onResults(results) {
    // Hide the spinner.

    // Update the frame rate.
    // Draw the overlays.
    this.canvasCtx.save();

    this.canvasCtx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.canvasCtx.drawImage(
      results.image,
      0,
      0,
      this.canvas.width,
      this.canvas.height
    );
    if (results.multiHandLandmarks && results.multiHandedness) {
      for (let index = 0; index < results.multiHandLandmarks.length; index++) {
        const classification = results.multiHandedness[index];
        const isRightHand = classification.label === "Right";
        const landmarks = results.multiHandLandmarks[index];
        drawConnectors(this.canvasCtx, landmarks, HAND_CONNECTIONS, {
          color: isRightHand ? "#00FF00" : "#FF0000",
        });
        drawLandmarks(this.canvasCtx, landmarks, {
          color: isRightHand ? "#00FF00" : "#FF0000",
          fillColor: isRightHand ? "#FF0000" : "#00FF00",
          radius: (data) => {
            return lerp(data.from.z, -0.15, 0.1, 10, 1);
          },
        });
      }
    }

    this.canvasCtx.restore();
  }
}
