import { render } from '@testing-library/react';
import Footer from '.';

it('renders as expected', () => {
  const { container } = render(<Footer />);
  expect(container).toMatchSnapshot();
});
