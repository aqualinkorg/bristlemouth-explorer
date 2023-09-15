export interface Spotter {
  name: string;
  spotterId: string;
}

export interface GetSpotterRequestResponse {
  message: string;
  data: {
    devices: Spotter[];
  };
}

export interface SensorData {
  latitude: number;
  longitude: number;
  timestamp: string;
  sensorPosition: number | null;
  units: string;
  value: string | number;
  unit_type: string;
  data_type_name: string;
}

export interface GetSensorDataRequestResponse {
  status: string;
  data: SensorData[];
}
