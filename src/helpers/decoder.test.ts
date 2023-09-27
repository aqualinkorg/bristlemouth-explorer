import { defaultDecoder } from 'src/decoders/default';
import { decode } from './decoder';
import {
  mockDefaultDecoderInputs,
  mockDefaultDecoderOutputs,
} from 'src/mocks/defaultDecoder';

describe('Decoders', () => {
  it('Default decoder processes data correctly', () => {
    const result = mockDefaultDecoderInputs.map((x) =>
      decode({ decoderConfig: defaultDecoder.config, hexData: x }),
    );

    expect(result).toMatchObject(mockDefaultDecoderOutputs);
  });
});
