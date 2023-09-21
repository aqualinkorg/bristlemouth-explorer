import { Spotter } from 'src/helpers/types';

export interface Settings {
  selectedSpotter: Spotter | null;
  sofarApiToken: string;
  spotterDataStartDate: string | null;
  spotterDataEndDate: string | null;
  SpotterNodeId: string;
  decoder: string;
  timestamp: 'native' | 'utc';
}

export type SettingsState = Partial<Settings>;
