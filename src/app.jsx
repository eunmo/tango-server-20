import React from 'react';
import {
  BrowserRouter as Router,
  Redirect,
  Route,
  Switch,
} from 'react-router-dom';
import Container from '@material-ui/core/Container';

import AppBar from './app-bar';
import Search from './search';

export default () => (
  <Router>
    <AppBar />
    <Container maxWidth="md" component="main">
      <Switch>
        <Route path="/search">
          <Search />
        </Route>
        <Redirect from="/" to="/search" exact />
      </Switch>
    </Container>
  </Router>
);
