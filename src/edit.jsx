import React, { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import makeStyles from '@mui/styles/makeStyles';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

import { get, put, fetchDelete } from './utils';

const useStyles = makeStyles({
  header: {
    margin: '16px 0px',
  },
  buttons: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  button: {
    marginTop: '24px',
  },
});

export default () => {
  const { level, index } = useParams();
  const history = useHistory();
  const [word, setWord] = useState('');
  const [yomigana, setYomigana] = useState('');
  const [meaning, setMeaning] = useState('');
  const classes = useStyles();

  useEffect(() => {
    get(`/api/select/${level}/${index}`, (data) => {
      const { word: w, yomigana: y, meaning: m } = data;
      setWord(w ?? '');
      setYomigana(y ?? '');
      setMeaning(m ?? '');
    });
  }, [level, index]);

  const onWord = (e) => {
    setWord(e.target.value);
  };

  const onYomigana = (e) => {
    setYomigana(e.target.value);
  };

  const onMeaning = (e) => {
    setMeaning(e.target.value);
  };

  const edit = () => {
    put(
      '/api/crud',
      {
        level,
        index,
        word: word.trim(),
        yomigana: yomigana.trim(),
        meaning: meaning.trim(),
      },
      () => {
        history.push(`/search/${word.trim()}`);
      }
    );
  };

  const remove = () => {
    fetchDelete('/api/crud', { level, index }, () => {
      history.push(`/search/${word.trim()}`);
    });
  };

  return (
    <>
      <Typography variant="h5" className={classes.header}>
        {`Edit ${level}: ${index}`}
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Word"
            value={word}
            onChange={onWord}
            inputProps={{ 'aria-label': 'word' }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Yomigana"
            value={yomigana}
            onChange={onYomigana}
            inputProps={{ 'aria-label': 'yomigana' }}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Meaning"
            value={meaning}
            onChange={onMeaning}
            inputProps={{ 'aria-label': 'meaning' }}
          />
        </Grid>
      </Grid>
      <div className={classes.buttons}>
        <Button
          variant="contained"
          color="primary"
          className={classes.button}
          onClick={edit}
          aria-label="edit"
        >
          edit
        </Button>
        <Button
          variant="contained"
          color="secondary"
          className={classes.button}
          onClick={remove}
          aria-label="remove"
        >
          remove
        </Button>
      </div>
    </>
  );
};
