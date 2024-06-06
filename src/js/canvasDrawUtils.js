import Konva from "konva";

export default class DrawingUtils {
  constructor(canvas, width, height) {
    this.ctx = canvas.getContext("2d");
    this.stage = new Konva.Stage({
      container: "dashboard",
      width: canvas.width,
      height: canvas.height,
    });
    this.layer = new Konva.Layer();
    this.startTime = Date.now();
  }
  drawText(config = { text: "", x: 0, y: 0, fontSize: 8 }) {
    const elapsedTime = Math.floor((Date.now() - this.startTime) / 1000);
    const minutes = Math.floor(elapsedTime / 60);
    const remainingSeconds = elapsedTime % 60;
    const simpleText = new Konva.Text({
      x: this.stage.width() / 2,
      y: 15,
      text: "Simple Text",
      fontSize: 30,
      fontFamily: "Calibri",
      fill: "green",
    });
    simpleText.offsetX(simpleText.width() / 2);
    const complexText = new Konva.Text({
      x: 20,
      y: 60,
      text:
        "COMPLEX TEXT\n\nAll the world's a stage, and all the men and women merely players. They have their exits and their entrances." +
        `${minutes} : ${remainingSeconds}`,
      fontSize: 18,
      fontFamily: "Calibri",
      fill: "#555",
      width: 300,
      padding: 20,
      align: "center",
    });
    const rect = new Konva.Rect({
      x: 20,
      y: 60,
      stroke: "#555",
      strokeWidth: 5,
      fill: "#ddd",
      width: 300,
      height: complexText.height(),
      shadowColor: "black",
      shadowBlur: 10,
      shadowOffsetX: 10,
      shadowOffsetY: 10,
      shadowOpacity: 0.2,
      cornerRadius: 10,
    });

    // add the shapes to the layer
    this.layer.add(simpleText);
    this.layer.add(rect);
    this.layer.add(complexText);
    this.stage.add(this.layer);
  }
  drawCircle(config = { radius: 5, x: 0, y: 0, fontSize: 8 }) {}
  drawRectangle(config = { x1: 0, y1: 0, x2: 10, y2: 10, fontSize: 8 }) {}
}
