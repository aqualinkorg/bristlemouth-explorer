import { Decoder, Spotter } from 'src/helpers/types';

export interface Settings {
  selectedSpotter: Spotter | null;
  sofarApiToken: string;
  spotterDataStartDate: string | null;
  spotterDataEndDate: string | null;
  spotterNodeId: string | null;
  userDefinedDecoders: Decoder[];
  decoder: string;
  timestampFormat: 'user' | 'utc';
}

export type SettingsState = Partial<Settings>;
