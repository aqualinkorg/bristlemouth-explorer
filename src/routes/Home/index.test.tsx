import { render } from '@testing-library/react';
import Home from '.';

it('renders as expected', () => {
  const { container } = render(<Home />);
  expect(container).toMatchSnapshot();
});
