import { render } from '@testing-library/react';
import SensorSelector from '.';

it('renders as expected', () => {
  const { container } = render(<SensorSelector />);
  expect(container).toMatchSnapshot();
});
