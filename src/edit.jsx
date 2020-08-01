import React, { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';

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
    setWord(e.target.value.trim());
  };

  const onYomigana = (e) => {
    setYomigana(e.target.value.trim());
  };

  const onMeaning = (e) => {
    setMeaning(e.target.value.trim());
  };

  const edit = () => {
    put('/api/crud', { level, index, word, yomigana, meaning }, () => {
      history.push(`/search/${word}`);
    });
  };

  const remove = () => {
    fetchDelete('/api/crud', { level, index }, () => {
      history.push(`/search/${word}`);
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
