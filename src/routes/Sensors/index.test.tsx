import { render } from '@testing-library/react';
import Sensors from '.';
import configureStore from 'redux-mock-store';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
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
    sofarApiToken: undefined,
    spotterDataStartDate: '2023-09-20T03:00:00.000+03:00',
    spotterDataEndDate: '2023-09-20T03:00:00.000+03:00',
    spotterNodeId: undefined,
    decoder: undefined,
    timestamp: undefined,
  },
});

store.dispatch = jest.fn();

it('renders as expected', () => {
  const { container } = render(
    <Provider store={store}>
      <BrowserRouter>
        <Sensors />
      </BrowserRouter>
    </Provider>,
  );
  expect(container).toMatchSnapshot();
});
