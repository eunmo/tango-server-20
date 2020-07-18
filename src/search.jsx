import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import InputBase from '@material-ui/core/InputBase';
import IconButton from '@material-ui/core/IconButton';
import Paper from '@material-ui/core/Paper';
import { Clear, Search } from '@material-ui/icons';

import Words from './words';
import get from './utils';

const useStyles = makeStyles({
  root: {
    margin: '16px 0px',
    padding: '2px 4px',
    display: 'flex',
    flexGrow: 1,
  },
  input: {
    flex: 1,
  },
  iconButton: {
    padding: 10,
  },
});

export default () => {
  const [keyword, setKeyword] = useState('');
  const [words, setWords] = useState([]);
  const classes = useStyles();

  const submit = (e) => {
    e.preventDefault();
    get(`/api/search/${keyword}`, setWords);
  };

  const clear = () => {
    setKeyword('');
    setWords([]);
  };

  return (
    <>
      <Paper
        component="form"
        variant="outlined"
        className={classes.root}
        onSubmit={(e) => submit(e)}
      >
        <IconButton
          type="submit"
          className={classes.iconButton}
          aria-label="search"
        >
          <Search />
        </IconButton>
        <InputBase
          className={classes.input}
          placeholder="Search Tango"
          value={keyword}
          onChange={({ target }) => setKeyword(target.value)}
          inputProps={{ 'aria-label': 'search tango' }}
        />
        <IconButton
          className={classes.iconButton}
          aria-label="directions"
          onClick={clear}
        >
          <Clear />
        </IconButton>
      </Paper>
      {words.length > 0 && <Words words={words} />}
    </>
  );
};
