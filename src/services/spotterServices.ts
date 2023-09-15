import { Request, generateUrlQueryParams } from 'src/helpers/requests';
import {
  GetSensorDataRequestResponse,
  GetSpotterRequestResponse,
} from 'src/helpers/types';
import { GetSensorDataParams, GetSofarDevicesParams } from './types';

const SOFAR_BASE_URL = 'https://api.sofarocean.com/api';

const request = new Request(SOFAR_BASE_URL);

const getSofarDevices = (params: GetSofarDevicesParams) =>
  request.send<GetSpotterRequestResponse>({
    url: `devices${generateUrlQueryParams({ ...params })}`,
    method: 'GET',
  });

const getSensorData = (params: GetSensorDataParams) =>
  request.send<GetSensorDataRequestResponse>({
    url: `sensor-data${generateUrlQueryParams({ ...params })}`,
    method: 'GET',
  });

export default {
  getSofarDevices,
  getSensorData,
};
