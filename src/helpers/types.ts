export interface Spotter {
  name?: string | null;
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
  bristlemouth_node_id: string;
  units: string;
  value: string | number;
  unit_type: string;
  data_type_name: string;
}

export interface GetSensorDataRequestResponse {
  status: string;
  data: SensorData[];
}
