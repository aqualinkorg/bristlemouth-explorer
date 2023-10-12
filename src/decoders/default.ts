/**
 * This is a sample decoder configuration, as per the example provided here:
 * https://bristlemouth.notion.site/Bristlemouth-Dev-Kit-Guide-5-Developing-a-Simple-Application-a69c351dadba4772926ada25a08a43fc
 * A decoder comprises a list of sensors. Each sensor is described by a struct,
 * which contains information about the datatype and the name of the encoded values.
 * The "display" attribute is used to select the values that will be displayed on the table in this application.
 */

import { Decoder, SensorStruct } from 'src/helpers/types';

const defaultSensorStruct: SensorStruct = [
  { key: 'sample_count', dataType: 'uint16_t', display: false },
  { key: 'mean', dataType: 'float', display: true },
  { key: 'stdev', dataType: 'float', display: false },
];

export const defaultDecoder: Decoder = {
  name: 'Toolkit Example (default)',
  config: [
    { name: 'temp', struct: defaultSensorStruct },
    { name: 'hum', struct: defaultSensorStruct },
  ],
};
