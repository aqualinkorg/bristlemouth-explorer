import { Spotter } from 'src/helpers/types';

export interface SpottersState {
  list: Spotter[];
  spottersRequestLoading: boolean;
  error: string | null | undefined;
}
