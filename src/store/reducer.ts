import { combineReducers } from 'redux';
import spotters from './spotters/spottersSlice';

const appReducer = combineReducers({
  spotters,
});

export default appReducer;
