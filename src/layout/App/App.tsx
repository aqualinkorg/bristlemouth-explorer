import { ThemeProvider } from '@mui/material';
import theme from './theme';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from 'src/routes/Home';
import About from 'src/routes/About';
import { Provider as ReduxProvider } from 'react-redux';
import { store } from 'src/store/configure';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import Sensors from 'src/routes/Sensors';

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
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />,
            <Route path="/about" element={<About />} />,
            <Route path="/sensors" element={<Sensors />} />,
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </ReduxProvider>
  );
}

export default App;
