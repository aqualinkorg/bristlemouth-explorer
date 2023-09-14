import { render } from '@testing-library/react';
import Terminal from '.';

it('renders as expected', () => {
  const { container } = render(<Terminal />);
  expect(container).toMatchSnapshot();
});
