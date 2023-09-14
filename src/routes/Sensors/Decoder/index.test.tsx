import { render } from '@testing-library/react';
import Decoder from '.';

it('renders as expected', () => {
  const { container } = render(<Decoder />);
  expect(container).toMatchSnapshot();
});
