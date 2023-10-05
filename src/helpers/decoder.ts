/* eslint-disable fp/no-mutation */
import { defaultDecoder } from 'src/decoders/default';
import { Decoder, DecoderConfig, DecoderOutput, SensorStruct } from './types';
import { Buffer } from 'buffer';

interface HexToStructProps {
  byteData: Buffer;
  structDescription: SensorStruct;
  offset: number;
}

/**
 * This function converts hexadecimal data to a structured format.
 * It takes a buffer of byte data, a description of the sensor structure, and an offset as input.
 * The function iterates over the byte data according to the sensor structure and converts the data to a structured format.
 * The offset is used to keep track of the position in the byte data.
 */
function hexToStruct({
  byteData,
  structDescription,
  offset: initialOffset,
}: HexToStructProps): {
  offset: number;
  decoded: {
    [key: string]: number;
  };
} {
  const decoded: { [key: string]: number } = {};
  let offset = initialOffset;

  for (const { key, dataType } of structDescription) {
    if (dataType === 'uint16_t') {
      decoded[key] = byteData.readUInt16LE(offset);
      offset += 2;
    } else if (dataType === 'double') {
      decoded[key] = byteData.readDoubleLE(offset);
      offset += 8;
    } else if (dataType === 'float') {
      decoded[key] = byteData.readFloatLE(offset);
      offset += 4;
    } else {
      throw new Error(`Unsupported data type: ${dataType}`);
    }
  }

  return { decoded, offset };
}

interface DecodeProps {
  decoderConfig: DecoderConfig;
  hexData: string;
}

/**
 * This function decodes the hex data using the provided decoder configuration.
 * It iterates over each struct in the decoder configuration, and for each struct, it decodes the corresponding part of the hex data.
 * The decoded data is then stored in the result object, with the struct name as the key.
 */
export function decode({ decoderConfig, hexData }: DecodeProps): DecoderOutput {
  const byteData = Buffer.from(hexData.replace(/\s+/g, ''), 'hex');
  const result: DecoderOutput = {};
  let offset = 0;

  for (const { name, struct } of decoderConfig) {
    const { decoded, offset: newOffset } = hexToStruct({
      byteData,
      structDescription: struct,
      offset,
    });
    result[name] = decoded;
    offset = newOffset;
  }

  return result;
}

export const decoders: Decoder[] = [defaultDecoder];
