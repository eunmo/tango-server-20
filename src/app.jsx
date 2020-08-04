import React from 'react';
import {
  BrowserRouter as Router,
  Redirect,
  Route,
  Switch,
} from 'react-router-dom';
import Container from '@material-ui/core/Container';

import AppBar from './app-bar';
import Search from './searchRoute';
import Edit from './edit';
import Add from './add';
import Summary from './summary';

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
);
