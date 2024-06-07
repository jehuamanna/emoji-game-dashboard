import { Hands, HAND_CONNECTIONS } from "@mediapipe/hands";
import { drawConnectors, lerp, drawLandmarks } from "@mediapipe/drawing_utils";
import { checkActions } from "./emoji-detector";
import DrawingUtils from "./canvasDrawUtils";
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
    this.draw = this.draw.bind(this);
    this.hands = new Hands(config);
    this.count = 0;
    this.seqDict = undefined;
    this.emoji_ = undefined;
    this.string_ = undefined;
    this.startTime = 0;
    this.lastTime = performance.now();
    this.frameCount = 0;
    this.fps = 0;
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
    this.du = new DrawingUtils(this.canvasDB);
    this.hands.onResults(this.onResults);
    this.onFrame();
    this.startTime = Date.now();
  }

  onFrame() {
    const animate = (timestamp) => {
      this.hands
        .send({ image: this.video })
        .then(() => {
          return new Promise((resolve, reject) => {
            // this.draw();
            const delta = timestamp - this.lastTime;
            this.lastTime = timestamp;
            this.frameCount++;
            if (delta > 0) {
              this.fps = Math.round(1000 / delta);
            }
            requestAnimationFrame(resolve);
          });
        })
        .then(animate);
    };
    return requestAnimationFrame(animate);
  }

  drawCircle(color, x, y, r = 0.06 * this.canvasDB.width) {
    var centerX = x;
    var centerY = y;
    var radius = r;

    this.canvasDBCtx.beginPath();
    this.canvasDBCtx.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);
    this.canvasDBCtx.fillStyle = color; //"#4b9fc9";
    this.canvasDBCtx.fill();
  }

  drawEmojiOnCanvas(emoji, x, y, fontSize = 4) {
    this.canvasDBCtx.font = `${parseInt(
      parseInt(fontSize * this.canvasDB.width) / 100
    )}pt serif`;
    this.canvasDBCtx.textAlign = "center";
    this.canvasDBCtx.fillStyle = "black";
    this.canvasDBCtx.textBaseline = "middle"; //"\u{1F91A}"
    this.canvasDBCtx.fillText(emoji, x, y);
  }
  drawText(text, x, y, lineHeight) {
    const lines = text.split("\n");
    for (let i = 0; i < lines.length; i++) {
      this.canvasDBCtx.font = `${0.025 * this.canvasDB.width}pt serif`;
      this.canvasDBCtx.fillText(lines[i], x, y + i * lineHeight);
    }
  }

  draw() {
    this.du.drawText();
    // requestAnimationFrame(this.draw);
  }

  onResults(results) {
    // Hide the spinner.

    // Update the frame rate.
    // Draw the overlays.
    this.canvasCtx.save();
    // this.du.drawText();

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
          color: isRightHand ? "#f23484" : "#fa614b",
          lineWidth: 1,
        });
        drawLandmarks(this.canvasCtx, landmarks, {
          color: isRightHand ? "#dd9a1f0" : "#dd9a1f0",
          fillColor: isRightHand ? "#fa404e" : "#e0784a",
          lineWidth: 1,
          radius: (data) => {
            return lerp(data.from.z, -0.15, 0.1, 5, 1);
          },
        });
      }
    }
    // console.log(results);
    var radius = 0.06 * this.canvasDB.width;
    const emojiX = this.canvasDB.width / 8 - radius;
    const emojiY = this.canvasDB.height / 4;
    const scoreX = this.canvas.width / 4 - radius;
    const scoreY = this.canvas.height / 4;
    const timeX = (this.canvas.width * 3) / 8 - radius;
    const timeY = this.canvas.height / 4;
    const speedX = (this.canvas.width * 7) / 8 - radius;
    const speedY = this.canvas.height / 4;

    const FPS_X = (this.canvas.width * 5) / 8 - radius;
    const FPS_Y = this.canvas.height / 4;

    const elapsedTime = Math.floor((Date.now() - this.startTime) / 1000);
    const minutes = Math.floor(elapsedTime / 60);
    const remainingSeconds = elapsedTime % 60;

    this.drawEmojiOnCanvas(this.count, scoreX, scoreY);
    this.drawCircle("#28683c", scoreX, scoreY);
    this.drawCircle("orange", timeX, timeY);
    this.drawCircle("#e403bb", speedX, speedY, 0.13 * this.canvasDB.width);
    this.drawEmojiOnCanvas(this.count, scoreX, scoreY);
    this.drawEmojiOnCanvas(`${minutes}:${remainingSeconds}`, timeX, timeY);
    this.drawText(
      `Emojies\nper\nMinute:\n\n${parseInt(this.count / (elapsedTime / 60))}`,
      speedX,
      speedY - 0.05 * this.canvasDB.width,
      0.035 * this.canvasDB.width
    );

    this.drawCircle("yellow", FPS_X, FPS_Y);
    this.drawEmojiOnCanvas(`FPS: ${this.fps}`, FPS_X, FPS_Y, 2);

    if (results?.multiHandedness?.[0] || results?.multiHandedness?.[1]) {
      const x = checkActions(
        this.string_,
        results.multiHandLandmarks?.[0] || results.multiHandLandmarks?.[0]
      );
      console.log(x, this.string_, this.emoji_);

      if (x) {
        this.count++;
        this.drawCircle("green", emojiX, emojiY);
        this.drawEmojiOnCanvas(this.emoji_, emojiX, emojiY);
        setTimeout(() => {
          this.drawCircle("#c70000", emojiX, emojiY);
          this.drawEmojiOnCanvas(this.emoji_, emojiX, emojiY);
        }, 1000);
        this.seqDict = this.getShuffledDictionary();
        this.emoji_ = Object.values(this.seqDict)[0];
        this.string_ = Object.keys(this.seqDict)[0];
      } else {
        this.drawCircle("#c70000", emojiX, emojiY);
        this.drawEmojiOnCanvas(this.emoji_, emojiX, emojiY);
      }
    } else {
      this.drawCircle("#c70000", emojiX, emojiY);
      this.drawEmojiOnCanvas(this.emoji_, emojiX, emojiY);
    }
    this.canvasCtx.restore();
  }
}
