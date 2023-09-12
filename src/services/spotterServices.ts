import { Request, generateUrlQueryParams } from 'src/helpers/requests';
import { GetSpotterRequestResponse } from 'src/helpers/types';

const SOFAR_BASE_URL = 'https://api.sofarocean.com/api';

const request = new Request(SOFAR_BASE_URL);

const getSiteSurveyPoints = (token: string) =>
  request.send<GetSpotterRequestResponse>({
    url: `devices${generateUrlQueryParams({ token })}`,
    method: 'GET',
  });

export default {
  getSiteSurveyPoints,
};
