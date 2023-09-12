import { useDispatch } from 'react-redux';
import type { AppDispatch } from './configure';

export const useAppDispatch = () => useDispatch<AppDispatch>();
