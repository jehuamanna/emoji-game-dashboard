import { Hands, HAND_CONNECTIONS } from "@mediapipe/hands";
import { drawConnectors, lerp, drawLandmarks } from "@mediapipe/drawing_utils";
import { checkActions } from "./emoji-detector";
const config = {
  locateFile: (file) => {
    return `/assets/models-assets/${file}`;
  },
};

const emojies = {
  upward_palm: "\u{1F91A}",
  thumbs_up: "\u{1F44D}",
  victory: "\u{270C}",
  left_pointing: "\u{1F448}",
  right_pointing: "\u{1F449}",
  upward_pointing: "\u{1F446}",
  downward_pointing: "\u{1F447}",
  left_palm: "\u{1FAF2}",
  right_palm: "\u{1FAF1}",
};

export default class HandsController {
  constructor(video, canvas, canvasDB) {
    this.video = video;
    this.canvas = canvas;
    this.canvasCtx = canvas.getContext("2d");
    this.canvasDB = canvasDB;
    this.canvasDBCtx = canvasDB.getContext("2d");
    this.onResults = this.onResults.bind(this);
    this.onFrame = this.onFrame.bind(this);
    this.hands = new Hands(config);

    this.seqDict = undefined;
    this.emoji_ = undefined;
    this.string_ = undefined;
  }

  getShuffledDictionary() {
    const items = Object.entries(emojies);
    for (let i = items.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [items[i], items[j]] = [items[j], items[i]];
    }
    return Object.fromEntries(items);
  }
  async init() {
    this.seqDict = this.getShuffledDictionary();
    this.emoji_ = Object.values(this.seqDict)[0];
    this.string_ = Object.keys(this.seqDict)[0];
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

  onFrame() {
    const animate = () => {
      this.hands
        .send({ image: this.video })
        .then(() => {
          return new Promise((resolve, reject) => {
            requestAnimationFrame(resolve);
          });
        })
        .then(animate);
    };
    return animate();
  }

  drawCircle(emoji, color) {
    console.log("eee", emoji);
    var centerX = this.canvasDB.width / 6;
    var centerY = this.canvasDB.height / 4;
    var radius = 0.1 * this.canvasDB.width;

    this.canvasDBCtx.beginPath();
    this.canvasDBCtx.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);
    this.canvasDBCtx.fillStyle = color; //"#4b9fc9";
    this.canvasDBCtx.fill();
    this.drawEmojiOnCanvas(emoji);
  }

  drawEmojiOnCanvas(emoji) {
    this.canvasDBCtx.font = `${parseInt(
      parseInt(12 * this.canvasDB.width) / 100
    )}px serif`;
    this.canvasDBCtx.textAlign = "center";
    this.canvasDBCtx.fillStyle = "black";
    this.canvasDBCtx.textBaseline = "middle"; //"\u{1F91A}"
    this.canvasDBCtx.fillText(
      emoji,
      this.canvasDB.width / 6,
      this.canvasDB.height / 4
    );
  }

  onResults(results) {
    // Hide the spinner.

    // Update the frame rate.
    // Draw the overlays.
    this.canvasCtx.save();
    this.seqDict = this.getShuffledDictionary();

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
    // console.log(results);

    if (results.multiHandedness?.[0] || results.multiHandedness?.[1]) {
      const x = checkActions(
        this.string_,
        results.multiHandLandmarks?.[0] || results.multiHandLandmarks?.[0]
      );
      console.log(x, this.string_, this.emoji_);

      if (x) {
        this.drawCircle(this.emoji_, "green");
        setTimeout(() => {
          this.drawCircle(this.emoji_, "white");
        }, 1000);
        this.seqDict = this.getShuffledDictionary();
        this.emoji_ = Object.values(this.seqDict)[0];
        this.string_ = Object.keys(this.seqDict)[0];
      } else {
        this.drawCircle(this.emoji_, "white");
      }
    } else {
      this.drawCircle(this.emoji_, "white");
    }

    this.canvasCtx.restore();
  }
}
