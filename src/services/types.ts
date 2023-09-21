export interface GetSofarDevicesParams {
  token: string;
}

export interface GetSensorDataParams {
  token: string;
  spotterId: string;
  startDate?: string;
  endDate?: string;
}
