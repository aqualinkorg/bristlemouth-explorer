import { render } from '@testing-library/react';
import DataTable from '.';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { sensorDataMock } from 'src/mocks/sensorDataMock';

const mockStore = configureStore([]);

const store = mockStore({
  spotters: {
    list: [],
    sensorData: sensorDataMock,
    sensorDataLoading: false,
    spottersRequestLoading: false,
    error: null,
  },
});

store.dispatch = jest.fn();

it('renders as expected', () => {
  const { container } = render(
    <Provider store={store}>
      <DataTable />
    </Provider>,
  );
  expect(container).toMatchSnapshot();
});
