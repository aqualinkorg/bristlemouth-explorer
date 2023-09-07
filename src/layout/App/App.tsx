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

const router = createBrowserRouter(
  createRoutesFromElements([
    <Route key="/" path="/" element={<Home />} />,
    <Route key="about" path="about" element={<About />} />,
  ]),
);

function App() {
  return (
    <ThemeProvider theme={theme}>
      <RouterProvider router={router} />
    </ThemeProvider>
  );
}

export default App;
