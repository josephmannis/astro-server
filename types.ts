export type SystemState = {
  lifeSupportState: LifeSupportState;
  navigationState: NavigationState;
  missionState: MissionState;
};

export type LifeSupportState = {
  bodyState: BodyState;
  suitState: SuitState;
};

export type BodyState = {
  // kCal
  caloriesBurned: number;
  // Degrees celsius
  bodyTemperature: number;
  //
};

export type SuitState = {
  // Milliampere hours
  currentBattery: number;
  // Milliampere hours
  maxBattery: number;
  // Milliampere hours per minute
  batteryDrain: number;
  // Litres of liquid?
  maxOxygen: number;
  // Litres of liquid?
  currentOxygen: number;
  // PSI
  tankPressure: number;
  // Litres per minute
  currentOxygenConsumption: number;
  // Percentage
  humidity: number;
  // Cycles per second
  radioactivity: number;
  // BPM
  heartRate: number;
  // PSI
  suitPressure: number;
};

export type NavigationState = {
  currentTrip?: Trip;
  tripHistory: Trip[];
};

type Trip = {
  startTimestamp: Date;
  endTimestamp: Date;
  tripDestinations: Point[];
};

type Point = {
  // ##.######
  latitude: number;
  // ##.######
  longitude: number;
};

export type MissionState = {
  // seconds
  totalMissionLength: number;
  // seconds
  missionTimeElapsed: number;
}

export type TaskListState = {
  tasks: Array<TaskState>;
}

export type TaskState = {
  description: string;
  time: string;
  subtasks: string[];
}

export type CommsListState = {
  voiceIndicators: Array<AstronautVoiceIndicatorState>;
}

export type AstronautVoiceIndicatorState = {
  astronautName: string;
  active: boolean;
  color: string;
}