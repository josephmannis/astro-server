import { LifeSupportState, SystemState, NavigationState } from "./types";

export function getSystemState(): SystemState {
    return {
        lifeSupportState: getLifeSupportState(),
        navigationState: getNavigationState(),
    };
}

export function getLifeSupportState(): LifeSupportState {
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

export function getNavigationState(): NavigationState {
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
  