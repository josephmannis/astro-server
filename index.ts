import MockData from './data';
import WebSocket from 'ws';

import { isHelloMessage, isNewSpatialAnchorMessage, isRequestActiveSpatialAnchorsMessage, Message, parseMessage } from "./protocol";

const wss = new WebSocket.Server({
  port: 5000
});

wss.on('connection', ws => {
  console.log("Connected");

  const mockData = new MockData();

  ws.on('message', data => {
    console.log('received: %s', data);

    console.log("Data");
    console.log(data.toString("utf-8"));
    const message = parseMessage(data.toString("utf-8"));
    console.log(message);

    if (message) {
      if (isHelloMessage(message)) {
        sendMessage(ws, {
          type: "HELLO",
          payload: undefined
        })
      }

      if (isNewSpatialAnchorMessage(message)) {
        sendMessage(ws, {
          type: "NEW_SPATIAL_ANCHOR_RECEIVED",
          payload: {
            anchorId: message.payload.anchorId
          }
        })
      }

      if (isRequestActiveSpatialAnchorsMessage(message)) {
        sendMessage(ws, {
          type: "ACTIVE_SPATIAL_ANCHORS",
          payload: {
            activeAnchorIds: []
          }
        });
      }
    }
  });

  let keepSendingUpdates = true
  ws.on("close", () => {
    keepSendingUpdates = false;
    console.log("Connection closed");
  });

  const sendPeriodicSystemUpdate = () => {
    if (!keepSendingUpdates) return;
    
    console.log("Sending system update");
    sendMessage(ws, {
      type: "SYSTEM_STATE",
      payload: mockData.getSystemState()
    }, () => {
      setTimeout(() => {
        sendPeriodicSystemUpdate();
      }, 500);
    });
  }

  sendPeriodicSystemUpdate();
});

wss.on("listening", function () {
  console.log(`Listening on port ${this.options.port}`);
})

function sendMessage(socket: WebSocket, message: Message, cb?: (err?: Error) => void) {
  socket.send(JSON.stringify(message), cb);
}
