import { Decoder, SensorStruct } from 'src/helpers/types';

const defaultSensorStruct: SensorStruct = [
  { key: 'sample_count', dataType: 'uint16_t', display: false },
  { key: 'mean', dataType: 'float', display: true },
  { key: 'stdev', dataType: 'float', display: false },
];

export const defaultDecoder: Decoder = {
  name: 'default',
  config: [
    { name: 'temp', struct: defaultSensorStruct },
    { name: 'hum', struct: defaultSensorStruct },
  ],
};
