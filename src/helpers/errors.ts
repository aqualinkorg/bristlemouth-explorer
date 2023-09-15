import { AxiosError } from 'axios';

export const getAxiosErrorMessage = (err: unknown): string =>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (((err as AxiosError)?.response?.data as any)?.message as
    | string
    | undefined) || 'Something went wrong';
