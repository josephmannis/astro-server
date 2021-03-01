import * as net from "net";
import { Message, parseMessage } from "./protocol";
import { getSystemState } from "./data";

const app = net.createServer(socket => {
  socket.pipe(socket);
});

app.on("connection", socket => {
  socket.on('data', data => {
    console.log("Data");
    const message = parseMessage(data.toString("utf-8"));
    console.log(message);
    if (message) {

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
