import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import makeStyles from '@mui/styles/makeStyles';
import AppBar from '@mui/material/AppBar';
import IconButton from '@mui/material/IconButton';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { Add, Details, Search } from '@mui/icons-material';

const useStyles = makeStyles({
  root: {
    flexGrow: 1,
    marginBottom: '16px',
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
    size="large"
  >
    {icon}
  </IconButton>
);

export default function () {
  const classes = useStyles();
  const navigate = useNavigate();

  if (window.isWebkit) {
    window.wkLink = (url) => {
      navigate(url);
    };
    return <div className={classes.root} />;
  }

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
}
