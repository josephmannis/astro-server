import { LifeSupportState, SystemState, NavigationState, MissionState, CommsListState } from "./types";

export default class MockData {
    startDate = new Date();

    getSystemState(): SystemState {
        return {
            lifeSupportState: this.getLifeSupportState(),
            navigationState: this.getNavigationState(),
            missionState: this.getMissionState()
        };
    }
    
    getLifeSupportState(): LifeSupportState {
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
                heartRate: randomInt(60, 100),
                suitPressure: 3000,
            },
        };
    }
    
    getNavigationState(): NavigationState {
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
    
    getMissionState(): MissionState {
        return {
            totalMissionLength: 90*60, // 30 min
            missionTimeElapsed: Math.round(((new Date()).getTime() - this.startDate.getTime())/1000)
        };
    }

    getCommsState(): CommsListState {
        return {
            voiceIndicators: [
                {
                    astronautName: "Ground",
                    active: true,
                    color: '#76B3EF'
                },
                {
                    astronautName: "Cobb",
                    active: true,
                    color: '#76EF98'
                },
                {
                    astronautName: "Stevens",
                    active: false,
                    color: '#76EF98'
                }
            ]
        }
    }
}
  
function randomInt(min: number, max: number) { 
    return Math.round(randomNumber(min, max));
} 

function randomNumber(min: number, max: number) { 
    return Math.random() * (max - min) + min;
} 