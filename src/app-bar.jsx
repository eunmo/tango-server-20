import React from 'react';
import { Link } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import IconButton from '@material-ui/core/IconButton';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { Add, Details, Search } from '@material-ui/icons';

const useStyles = makeStyles({
  root: {
    flexGrow: 1,
  },
  title: {
    flexGrow: 1,
  },
});

const getIconButton = (name, icon) => (
  <IconButton
    aria-label={name}
    color="inherit"
    component={Link}
    to={`/${name}`}
  >
    {icon}
  </IconButton>
);

export default () => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" className={classes.title}>
            Tango
          </Typography>
          <div className={classes.grow} />
          {getIconButton('search', <Search />)}
          {getIconButton('add', <Add />)}
          {getIconButton('summary', <Details />)}
        </Toolbar>
      </AppBar>
    </div>
  );
};
