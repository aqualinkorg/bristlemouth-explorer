import { ThemeProvider } from '@mui/material';
import theme from './theme';
import {
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
} from 'react-router-dom';
import Home from 'src/routes/Home';
import About from 'src/routes/About';
import { Provider as ReduxProvider } from 'react-redux';
import { store } from 'src/store/configure';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';

const router = createBrowserRouter(
  createRoutesFromElements([
    <Route key="/" path="/" element={<Home />} />,
    <Route key="about" path="about" element={<About />} />,
  ]),
);

function App() {
  return (
    <ReduxProvider store={store}>
      <ThemeProvider theme={theme}>
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick={false}
          rtl
          pauseOnFocusLoss={false}
          draggable
          pauseOnHover={false}
          theme="light"
        />
        <RouterProvider router={router} />
      </ThemeProvider>
    </ReduxProvider>
  );
}

export default App;
