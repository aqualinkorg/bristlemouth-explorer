import { AxiosError } from 'axios';

export const getAxiosErrorMessage = (err: unknown): string =>
  ((err as AxiosError)?.response?.data as string | undefined) ||
  'Something went wrong';
