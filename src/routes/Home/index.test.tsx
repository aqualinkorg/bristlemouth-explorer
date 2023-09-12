import { render } from '@testing-library/react';
import configureStore from 'redux-mock-store';
import { Provider } from 'react-redux';
import Home from '.';

const mockStore = configureStore([]);

const store = mockStore({
  spotters: {
    list: [],
    spottersRequestLoading: false,
    error: null,
  },
});

store.dispatch = jest.fn();

it('renders as expected', () => {
  const { container } = render(
    <Provider store={store}>
      <Home />
    </Provider>,
  );
  expect(container).toMatchSnapshot();
});
