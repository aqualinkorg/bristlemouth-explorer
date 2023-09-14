import { render } from '@testing-library/react';
import DataTable from '.';

it('renders as expected', () => {
  const { container } = render(<DataTable />);
  expect(container).toMatchSnapshot();
});
