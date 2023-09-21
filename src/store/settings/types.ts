import { Spotter } from 'src/helpers/types';

export interface Settings {
  selectedSpotter: Spotter | null;
  sofarApiToken: string;
  spotterDataStartDate: string | null;
  spotterDataEndDate: string | null;
  spotterNodeId: string;
  decoder: string;
  timestamp: 'user' | 'utc';
}

export type SettingsState = Partial<Settings>;
