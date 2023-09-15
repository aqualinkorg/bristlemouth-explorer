import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { SpottersState } from './types';
import { CreateAsyncThunkTypes, RootState } from '../configure';
import spotterServices from 'src/services/spotterServices';
import { Spotter } from 'src/helpers/types';
import { getAxiosErrorMessage } from 'src/helpers/errors';

const spottersInitialState: SpottersState = {
  list: [],
  spottersRequestLoading: false,
  error: null,
};

export const spottersRequest = createAsyncThunk<
  Spotter[],
  string,
  CreateAsyncThunkTypes
>('spotters/spottersRequest', async (token: string, { rejectWithValue }) => {
  try {
    const { data } = await spotterServices.getSiteSurveyPoints(token);
    return data.data.devices;
  } catch (err) {
    return rejectWithValue(getAxiosErrorMessage(err));
  }
});

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
  },
});

export const spottersListSelector = (state: RootState): SpottersState['list'] =>
  state.spotters.list;

export const spottersListLoadingSelector = (
  state: RootState,
): SpottersState['spottersRequestLoading'] =>
  state.spotters.spottersRequestLoading;

export const spottersListErrorSelector = (
  state: RootState,
): SpottersState['error'] => state.spotters.error;

export default spottersSlice.reducer;
