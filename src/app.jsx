import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Container from '@mui/material/Container';
import useMediaQuery from '@mui/material/useMediaQuery';
import {
  createTheme,
  ThemeProvider,
  StyledEngineProvider,
  adaptV4Theme,
} from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

import AppBar from './app-bar';
import Search from './searchRoute';
import Edit from './edit';
import Add from './add';
import Summary from './summary';

export default function App() {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');

  const theme = React.useMemo(
    () =>
      createTheme(
        adaptV4Theme({
          palette: {
            mode: prefersDarkMode ? 'dark' : 'light',
          },
        })
      ),
    [prefersDarkMode]
  );

  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          <AppBar />
          <Container maxWidth="md" component="main">
            <Routes>
              <Route index element={<Search />} />
              <Route path="search/:keyword" element={<Search />} />
              <Route path="search" element={<Search />} />
              <Route path="edit/:level/:index" element={<Edit />} />
              <Route path="add" element={<Add />} />
              <Route path="summary" element={<Summary />} />
            </Routes>
          </Container>
        </Router>
      </ThemeProvider>
    </StyledEngineProvider>
  );
}
