import React from 'react';
import {
  BrowserRouter as Router,
  Redirect,
  Route,
  Switch,
} from 'react-router-dom';
import Container from '@mui/material/Container';
import useMediaQuery from '@mui/material/useMediaQuery';
import { createTheme, ThemeProvider, StyledEngineProvider, adaptV4Theme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

import AppBar from './app-bar';
import Search from './searchRoute';
import Edit from './edit';
import Add from './add';
import Summary from './summary';

export default () => {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');

  const theme = React.useMemo(
    () =>
      createTheme(adaptV4Theme({
        palette: {
          mode: prefersDarkMode ? 'dark' : 'light',
        },
      })),
    [prefersDarkMode]
  );

  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          <AppBar />
          <Container maxWidth="md" component="main">
            <Switch>
              <Route path="/search/:keyword">
                <Search />
              </Route>
              <Route path="/search">
                <Search />
              </Route>
              <Route path="/edit/:level/:index">
                <Edit />
              </Route>
              <Route path="/add">
                <Add />
              </Route>
              <Route path="/summary">
                <Summary />
              </Route>
              <Redirect from="/" to="/search" exact />
            </Switch>
          </Container>
        </Router>
      </ThemeProvider>
    </StyledEngineProvider>
  );
};
