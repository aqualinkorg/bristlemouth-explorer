import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { SettingsState } from './types';
import { settingsStorageKey } from 'src/helpers/constants';
import { RootState } from '../configure';

const emptyState: SettingsState = {
  selectedSpotter: undefined,
  sofarApiToken: undefined,
  spotterDataStartDate: undefined,
  spotterDataEndDate: undefined,
  spotterNodeId: undefined,
  decoder: undefined,
  timestamp: undefined,
};

function getInitialState(): SettingsState {
  const savedRaw = localStorage.getItem(settingsStorageKey);
  const savedJson = JSON.parse(
    savedRaw !== 'undefined' && savedRaw ? savedRaw : '{}',
  );

  const parsed: SettingsState = {
    ...emptyState,
    ...savedJson,
  };

  return parsed || {};
}

const settingsSlice = createSlice({
  name: 'settingsSlice',
  initialState: getInitialState(),
  reducers: {
    setSettings: (state, action: PayloadAction<SettingsState>) => {
      const { payload } = action;
      const newStore = {
        ...state,
        ...payload,
      };

      localStorage.setItem(settingsStorageKey, JSON.stringify(newStore));

      return newStore;
    },
  },
  extraReducers: () => {},
});

export const settingsSelector = (state: RootState): SettingsState =>
  state.settings;

export const { setSettings } = settingsSlice.actions;

export default settingsSlice.reducer;
