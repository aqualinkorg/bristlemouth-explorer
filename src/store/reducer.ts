import { combineReducers } from 'redux';
import spotters from './spotters/spottersSlice';
import settings from './settings/settingsSlice';

const appReducer = combineReducers({
  spotters,
  settings,
});

export default appReducer;
