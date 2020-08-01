import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';

import { post, getYYMM } from './utils';

const useStyles = makeStyles({
  header: {
    margin: '16px 0px',
  },
  buttons: {
    display: 'flex',
  },
  button: {
    marginTop: '24px',
    marginRight: '8px',
  },
});

const languages = [
  { key: 'E', emoji: '🇬🇧' },
  { key: 'F', emoji: '🇫🇷' },
  { key: 'J', emoji: '🇯🇵' },
];

export default () => {
  const history = useHistory();
  const [yymm] = useState(getYYMM());
  const [word, setWord] = useState('');
  const [yomigana, setYomigana] = useState('');
  const [meaning, setMeaning] = useState('');
  const classes = useStyles();

  const onWord = (e) => {
    let [newWord, newYomigana] = [e.target.value.replace('’', "'"), null];
    let [opener, closer] = ['[', ']'];
    let index = newWord.indexOf(opener);
    if (index !== -1) {
      newYomigana = newWord.slice(0, index).replace(/\s/g, '');
      newWord = newWord.slice(index + 1).replace(closer, '');
    }

    [opener, closer] = ['（', '）'];
    index = newWord.indexOf(opener);
    if (index !== -1) {
      newYomigana = newWord.slice(index + 1).replace(closer, '');
      newWord = newWord.slice(0, index).replace(/\s/g, '');
    }

    index = newWord.lastIndexOf('·');
    if (index !== -1) {
      newWord = newWord.slice(index + 1);
    }

    if (newYomigana) {
      setYomigana(newYomigana);
    }
    setWord(newWord);
  };

  const onYomigana = (e) => {
    setYomigana(e.target.value);
  };

  const onMeaning = (e) => {
    setMeaning(e.target.value);
  };

  const add = (lang) => {
    const level = lang + yymm;
    post(
      '/api/crud',
      {
        level,
        word: word.trim(),
        yomigana: yomigana.trim(),
        meaning: meaning.trim(),
      },
      () => {
        history.push(`/search/${word.trim()}`);
      }
    );
  };

  return (
    <>
      <Typography variant="h5" className={classes.header}>
        {`New Word for ${yymm}`}
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
        {languages.map(({ key, emoji }) => (
          <Button
            key={key}
            variant="contained"
            className={classes.button}
            onClick={() => add(key)}
            aria-label={`add ${key}`}
          >
            {emoji}
          </Button>
        ))}
      </div>
    </>
  );
};
