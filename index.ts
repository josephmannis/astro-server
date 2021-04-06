import * as net from "net";
import { isHelloMessage, isNewSpatialAnchorMessage, isRequestActiveSpatialAnchorsMessage, Message, parseMessage } from "./protocol";
import { getSystemState } from "./data";

const app = net.createServer(socket => {
  socket.pipe(socket);
});

app.on("connection", socket => {
  socket.on('data', data => {
    console.log("Data");
    console.log(data.toString("utf-8"));
    const message = parseMessage(data.toString("utf-8"));
    console.log(message);

    if (message) {
      if (isHelloMessage(message)) {
        sendMessage(socket, {
          type: "HELLO",
          payload: undefined
        })
      }

      if (isNewSpatialAnchorMessage(message)) {
        sendMessage(socket, {
          type: "NEW_SPATIAL_ANCHOR_RECEIVED",
          payload: {
            anchorId: message.payload.anchorId
          }
        })
      }

      if (isRequestActiveSpatialAnchorsMessage(message)) {
        sendMessage(socket, {
          type: "ACTIVE_SPATIAL_ANCHORS",
          payload: {
            activeAnchorIds: []
          }
        });
      }
    }
  });

  sendMessage(socket, {
    type: "SYSTEM_STATE",
    payload: getSystemState()
  });
  // socket.end();
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});

function sendMessage(socket: net.Socket, message: Message) {
  socket.write(JSON.stringify(message));
}
