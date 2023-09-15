import { render } from '@testing-library/react';
import Sensors from '.';
import configureStore from 'redux-mock-store';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
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
      <BrowserRouter>
        <Sensors />
      </BrowserRouter>
    </Provider>,
  );
  expect(container).toMatchSnapshot();
});
