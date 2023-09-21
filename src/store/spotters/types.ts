import { SensorData, Spotter } from 'src/helpers/types';

export interface SpottersState {
  list: Spotter[];
  sensorData: SensorData[];
  spottersRequestLoading: boolean;
  sensorDataLoading: boolean;
  error: string | null | undefined;
}
