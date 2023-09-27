/* eslint-disable fp/no-mutation */
import { defaultDecoder } from 'src/decoders/default';
import { Decoder, DecoderConfig, DecoderOutput, SensorStruct } from './types';
import { Buffer } from 'buffer';

interface HexToStructProps {
  byteData: Buffer;
  structDescription: SensorStruct;
  offset: number;
}

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
