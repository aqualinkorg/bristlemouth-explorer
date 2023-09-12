import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

interface RequestParams {
  method: AxiosRequestConfig['method'];
  url: AxiosRequestConfig['url'];
  data?: AxiosRequestConfig['data'];
  params?: AxiosRequestConfig['params'];
  token?: string | null;
  responseType?: AxiosRequestConfig['responseType'];
  contentType?: string;
}

export class Request {
  constructor(baseURL: string) {
    this.instance = axios.create({
      baseURL,
      headers: {
        Accept: 'application/json, text/html',
        crossDomain: true,
      },
    });
  }

  agent = (contentType?: string) => {
    this.instance.defaults.headers['Content-Type'] =
      contentType || 'application/json';

    return this.instance;
  };

  send<T>(request: RequestParams): Promise<AxiosResponse<T>> {
    const headers = request.token
      ? { Authorization: `Bearer ${request.token}` }
      : {};
    return this.agent(request.contentType).request<T>({
      method: request.method,
      url: request.url,
      headers,
      data: request.data,
      params: request.params,
      responseType: request.responseType || 'json',
    });
  }

  instance: AxiosInstance;
}

export const generateUrlQueryParams = (params: Record<string, string>) => {
  const filteredParams = Object.entries(params).filter(
    ([, value]) => value !== undefined,
  );

  const stringifiedParams = new URLSearchParams(
    Object.fromEntries(filteredParams),
  ).toString();

  return stringifiedParams.length ? `?${stringifiedParams}` : '';
};
