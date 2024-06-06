import { Hands } from "@mediapipe/hands";
const config = {
  locateFile: (file) => {
    return `/assets/models-assets/${file}`;
  },
};

export default class HandsController {
  constructor() {}

  init() {
    const hands = new Hands(config);
    hands.onResults(this.onResults);
  }
  onResults(results) {
    // Hide the spinner.
    alert(9);

    // Update the frame rate.
    fpsControl.tick();
    // Draw the overlays.
    canvasCtx.save();
    canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
    canvasCtx.drawImage(
      results.image,
      0,
      0,
      canvasElement.width,
      canvasElement.height
    );
    if (results.multiHandLandmarks && results.multiHandedness) {
      for (let index = 0; index < results.multiHandLandmarks.length; index++) {
        const classification = results.multiHandedness[index];
        const isRightHand = classification.label === "Right";
        const landmarks = results.multiHandLandmarks[index];
        drawingUtils.drawConnectors(
          canvasCtx,
          landmarks,
          mpHands.HAND_CONNECTIONS,
          { color: isRightHand ? "#00FF00" : "#FF0000" }
        );
        drawingUtils.drawLandmarks(canvasCtx, landmarks, {
          color: isRightHand ? "#00FF00" : "#FF0000",
          fillColor: isRightHand ? "#FF0000" : "#00FF00",
          radius: (data) => {
            return drawingUtils.lerp(data.from.z, -0.15, 0.1, 10, 1);
          },
        });
      }
    }
    canvasCtx.restore();
    if (results.multiHandWorldLandmarks) {
      // We only get to call updateLandmarks once, so we need to cook the data to
      // fit. The landmarks just merge, but the connections need to be offset.
      const landmarks = results.multiHandWorldLandmarks.reduce(
        (prev, current) => [...prev, ...current],
        []
      );
      const colors = [];
      let connections = [];
      for (
        let loop = 0;
        loop < results.multiHandWorldLandmarks.length;
        ++loop
      ) {
        const offset = loop * mpHands.HAND_CONNECTIONS.length;
        const offsetConnections = mpHands.HAND_CONNECTIONS.map((connection) => [
          connection[0] + offset,
          connection[1] + offset,
        ]);
        connections = connections.concat(offsetConnections);
        const classification = results.multiHandedness[loop];
        colors.push({
          list: offsetConnections.map((unused, i) => i + offset),
          color: classification.label,
        });
      }
      grid.updateLandmarks(landmarks, connections, colors);
    } else {
      grid.updateLandmarks([]);
    }
  }
}
