import { render } from '@testing-library/react';
import Sensors from '.';

it('renders as expected', () => {
  const { container } = render(<Sensors />);
  expect(container).toMatchSnapshot();
});
