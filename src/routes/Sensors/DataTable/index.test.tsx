import { render } from '@testing-library/react';
import DataTable from '.';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { sensorDataMock } from 'src/mocks/sensorDataMock';
import { spotterListMock } from 'src/mocks/spotterListMock';

const mockStore = configureStore([]);

const store = mockStore({
  spotters: {
    list: spotterListMock,
    sensorData: sensorDataMock,
    sensorDataLoading: false,
    spottersRequestLoading: false,
    error: null,
  },
  settings: {
    selectedSpotter: spotterListMock[0],
    sofarApiToken: 'some token',
    spotterDataStartDate: undefined,
    spotterDataEndDate: undefined,
    spotterNodeId: undefined,
    decoder: undefined,
    timestampFormat: undefined,
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
