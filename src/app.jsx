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
import Edit from './edit';

export default () => (
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
        <Redirect from="/" to="/search" exact />
      </Switch>
    </Container>
  </Router>
);
