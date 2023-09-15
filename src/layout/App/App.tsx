import React from 'react';
import {
  Backdrop,
  CircularProgress,
  ThemeProvider,
  styled,
} from '@mui/material';
import theme from './theme';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from 'src/routes/Home';
import About from 'src/routes/About';
import { Provider as ReduxProvider, useSelector } from 'react-redux';
import { store } from 'src/store/configure';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';
import Sensors from 'src/routes/Sensors';
import {
  spottersListErrorSelector,
  spottersListLoadingSelector,
} from 'src/store/spotters/spottersSlice';

const StyledBackdrop = styled(Backdrop)(({ theme }) => ({
  zIndex: theme.zIndex.drawer,
}));

function Contents() {
  // Loading Selectors
  const spottersRequestLoading = useSelector(spottersListLoadingSelector);

  // Error Selectors
  const spottersRequestError = useSelector(spottersListErrorSelector);

  React.useEffect(() => {
    if (spottersRequestError) toast.warn(spottersRequestError);
  }, [spottersRequestError]);

  return (
    <>
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
      <StyledBackdrop open={spottersRequestLoading}>
        <CircularProgress color="primary" />
      </StyledBackdrop>
      <Routes>
        <Route path="/" element={<Home />} />,
        <Route path="/about" element={<About />} />,
        <Route path="/sensors" element={<Sensors />} />,
      </Routes>
    </>
  );
}

function App() {
  return (
    <ReduxProvider store={store}>
      <ThemeProvider theme={theme}>
        <BrowserRouter>
          <Contents />
        </BrowserRouter>
      </ThemeProvider>
    </ReduxProvider>
  );
}

export default App;
