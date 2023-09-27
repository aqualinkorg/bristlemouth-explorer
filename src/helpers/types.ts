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
  value: string;
  unit_type: string;
  data_type_name: string;
}

export interface GetSensorDataRequestResponse {
  status: string;
  data: SensorData[];
}

export type EncodedDataType = 'uint16_t' | 'float' | 'double';

export type SensorStruct = Array<{
  key: string;
  dataType: EncodedDataType;
  display: boolean;
}>;

export type DecoderConfig = Array<{
  name: string;
  struct: SensorStruct;
}>;

export interface Decoder {
  name: string;
  config: DecoderConfig;
}

export interface DecoderOutput {
  [sensor: string]: {
    [elem: string]: number;
  };
}
