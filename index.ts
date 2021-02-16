import * as net from "net";
import { LifeSupportState, SystemState, NavigationState } from "types";

const app = net.createServer(function (socket) {
  socket.pipe(socket);
});

app.on("connection", (socket) => {
  socket.write("Hi there.");
  sendSystemStatus(socket);
});

app.listen(5000);

function sendSystemStatus(socket: net.Socket) {
  socket.write(JSON.stringify(getSystemState()));
  socket.end();
}

function getSystemState(): SystemState {
  return {
    lifeSupportState: getLifeSupportState(),
    navigationState: getNavigationState(),
  };
}

function getLifeSupportState(): LifeSupportState {
  return {
    bodyState: {
      caloriesBurned: 5,
      bodyTemperature: 80,
    },
    suitState: {
      currentBattery: 5000,
      maxBattery: 10000,
      batteryDrain: 4.5,
      maxOxygen: 800,
      currentOxygen: 300,
      tankPressure: 2500,
      currentOxygenConsumption: 0.83,
      humidity: 0.4,
      radioactivity: 1,
      heartRate: 80,
      suitPressure: 3000,
    },
  };
}

function getNavigationState(): NavigationState {
  return {
    currentTrip: {
      startTimestamp: new Date(),
      endTimestamp: new Date(),
      tripDestinations: [
        {
          latitude: 30.654738,
          longitude: 10.123456,
        },
      ],
    },
    tripHistory: [],
  };
}
