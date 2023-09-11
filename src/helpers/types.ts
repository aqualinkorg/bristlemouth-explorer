export interface Spotter {
  name: string;
  spotterId: string;
}

export interface GetSpotterRequestResponse {
  message: string;
  data: {
    devices: Spotter[];
  };
}
