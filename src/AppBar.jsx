import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import MuiAppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { Add, Details, Search } from '@mui/icons-material';

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

export default function AppBar() {
  const navigate = useNavigate();

  if (window.isWebkit) {
    window.wkLink = (url) => {
      navigate(url);
    };
    return <Box mb={2} />;
  }

  return (
    <MuiAppBar position="static" sx={{ mb: 2 }}>
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Tango
        </Typography>
        {getIconButton('search', <Search />)}
        {getIconButton('add', <Add />)}
        {getIconButton('summary', <Details />)}
      </Toolbar>
    </MuiAppBar>
  );
}
