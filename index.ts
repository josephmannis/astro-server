import MockData from './data';
import WebSocket from 'ws';

import { isHelloMessage, isNewSpatialAnchorMessage, isRequestActiveSpatialAnchorsMessage, Message, parseMessage } from "./protocol";
import { TaskState } from 'types';

const stdin = process.openStdin(); 
// require('tty').setRawMode(true);    

const wss = new WebSocket.Server({
  port: 5000
});

wss.on('connection', ws => {
  console.log("Connected");

  const mockData = new MockData();

  let keepSendingUpdates = true
  // send periodic system updates (every 500ms)
  
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

  let taskUpdateCount = 0;

  const sendPeriodicTaskListUpdate = () => {
    if (!keepSendingUpdates) return;
    
    console.log("Sending task list update");

    const newTasks: Array<TaskState> = [
      {
        description: `Task from server 1 (${taskUpdateCount})`,
        time: '00:00',
        subtasks: ["Subtask 1"]
      },
      {
        description: `Task from server 2 (${taskUpdateCount})`,
        time: '00:00',
        subtasks: []
      },
      {
        description: `Task from server 3 (${taskUpdateCount})`,
        time: '00:00',
        subtasks: []
      }
    ];

    sendMessage(ws, {
      type: "TASK_LIST",
      payload: {
        tasks: newTasks
      }
    }, () => {
      taskUpdateCount++;
      setTimeout(() => {
        sendPeriodicTaskListUpdate();
      }, 3000);
    });
  }

  sendPeriodicTaskListUpdate();

  // stdin.on('keypress', (chunk, key) => {
  //   if (!keepSendingUpdates) return;

  //   if (key && key.ctrl && key.name == 't') {
  //     console.log("Sending task list update");
  //   }
  // });

  // on incoming message...
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

  // on socket closed
  ws.on("close", () => {
    keepSendingUpdates = false;
    console.log("Connection closed");
  });
});

wss.on("listening", function () {
  console.log(`Listening on port ${this.options.port}`);
})

function sendMessage(socket: WebSocket, message: Message, cb?: (err?: Error) => void) {
  socket.send(JSON.stringify(message), cb);
}
