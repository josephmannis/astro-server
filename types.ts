export type SystemState = {
  lifeSupportState: LifeSupportState;
  navigationState: NavigationState;
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
