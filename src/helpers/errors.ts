// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getAxiosErrorMessage = (err: any): string =>
  err?.response?.data?.message ?? 'Something went wrong';
