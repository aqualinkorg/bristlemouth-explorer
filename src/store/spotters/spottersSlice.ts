import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { SpottersState } from './types';
import { CreateAsyncThunkTypes, RootState } from '../configure';
import spotterServices from 'src/services/spotterServices';
import { SensorData, Spotter } from 'src/helpers/types';
import { getAxiosErrorMessage } from 'src/helpers/errors';
import { GetSensorDataParams, GetSofarDevicesParams } from 'src/services/types';

const spottersInitialState: SpottersState = {
  list: [],
  sensorData: [],
  sensorDataLoading: false,
  spottersRequestLoading: false,
  error: null,
};

export const spottersRequest = createAsyncThunk<
  Spotter[],
  GetSofarDevicesParams,
  CreateAsyncThunkTypes
>(
  'spotters/spottersRequest',
  async (requestParams: GetSofarDevicesParams, { rejectWithValue }) => {
    try {
      const { data } = await spotterServices.getSofarDevices(requestParams);
      return data.data.devices;
    } catch (err) {
      return rejectWithValue(getAxiosErrorMessage(err));
    }
  },
);

export const sensorDataRequest = createAsyncThunk<
  SensorData[],
  GetSensorDataParams,
  CreateAsyncThunkTypes
>(
  'spotters/sensorDataRequest',
  async (requestParams: GetSensorDataParams, { rejectWithValue }) => {
    try {
      const { data } = await spotterServices.getSensorData(requestParams);
      return data.data;
    } catch (err) {
      return rejectWithValue(getAxiosErrorMessage(err));
    }
  },
);

const spottersSlice = createSlice({
  name: 'spottersSlice',
  initialState: spottersInitialState,
  reducers: {
    clearSpottersList: (state) => ({ ...state, list: [] }),
  },
  extraReducers: (builder) => {
    builder.addCase(
      spottersRequest.fulfilled,
      (state, action: PayloadAction<Spotter[]>) => {
        return {
          ...state,
          list: action.payload,
          spottersRequestLoading: false,
        };
      },
    );
    builder.addCase(spottersRequest.rejected, (state, action) => {
      return {
        ...state,
        error: action.payload,
        spottersRequestLoading: false,
      };
    });
    builder.addCase(spottersRequest.pending, (state) => {
      return {
        ...state,
        spottersRequestLoading: true,
        error: null,
      };
    });

    builder.addCase(
      sensorDataRequest.fulfilled,
      (state, action: PayloadAction<SensorData[]>) => {
        return {
          ...state,
          sensorData: action.payload,
          sensorDataLoading: false,
        };
      },
    );
    builder.addCase(sensorDataRequest.rejected, (state, action) => {
      return {
        ...state,
        error: action.payload,
        sensorDataLoading: false,
      };
    });
    builder.addCase(sensorDataRequest.pending, (state) => {
      return {
        ...state,
        sensorDataLoading: true,
        error: null,
      };
    });
  },
});

export const spottersListSelector = (state: RootState): SpottersState['list'] =>
  state.spotters.list;

export const spottersListLoadingSelector = (
  state: RootState,
): SpottersState['spottersRequestLoading'] =>
  state.spotters.spottersRequestLoading;

export const sensorDataSelector = (
  state: RootState,
): SpottersState['sensorData'] => state.spotters.sensorData;

export const sensorDataLoadingSelector = (
  state: RootState,
): SpottersState['sensorDataLoading'] => state.spotters.sensorDataLoading;

export const spottersListErrorSelector = (
  state: RootState,
): SpottersState['error'] => state.spotters.error;

export default spottersSlice.reducer;
