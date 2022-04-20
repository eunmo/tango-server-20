import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import { ArrowDownward, ArrowUpward, Clear } from '@mui/icons-material';

import Search from './Search';
import { post, getYYMM } from './utils';

const languages = [
  { key: 'E', emoji: '🇬🇧' },
  { key: 'F', emoji: '🇫🇷' },
  { key: 'J', emoji: '🇯🇵' },
];

export default function Add() {
  const [yymm] = useState(getYYMM());
  const [word, setWord] = useState('');
  const [yomigana, setYomigana] = useState('');
  const [meaning, setMeaning] = useState('');
  const [keywordTo, setKeywordTo] = useState({});
  const [keywordFrom, setKeywordFrom] = useState('');
  const navigate = useNavigate();

  const updateWord = (newValue) => {
    let [newWord, newYomigana] = [newValue.replace('’', "'"), null];
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

  const onWord = (e) => {
    updateWord(e.target.value);
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
        navigate(`/search/${word.trim()}`);
      }
    );
  };

  const toSearch = () => {
    let initialKeyword = word;
    if (yomigana) {
      initialKeyword = `${yomigana}[${word}`;
    }
    setKeywordTo({ initialKeyword });
  };

  const fromSearch = () => {
    updateWord(keywordFrom);
  };

  const clearAll = () => {
    setWord('');
    setYomigana('');
    setMeaning('');
    setKeywordTo({ initialKeyword: '' });
  };

  return (
    <>
      <Search initialValue={keywordTo} onChange={setKeywordFrom} />
      <Box display="flex">
        <Button
          variant="contained"
          sx={{ my: 2, mr: 1 }}
          onClick={toSearch}
          aria-label="to search"
        >
          <ArrowUpward />
        </Button>
        <Button
          variant="contained"
          sx={{ my: 2, mr: 1 }}
          onClick={fromSearch}
          aria-label="from search"
        >
          <ArrowDownward />
        </Button>
        <Button
          variant="contained"
          sx={{ my: 2, mr: 1 }}
          onClick={clearAll}
          aria-label="clear all"
        >
          <Clear />
        </Button>
      </Box>
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
      <Box display="flex">
        {languages.map(({ key, emoji }) => (
          <Button
            key={key}
            variant="contained"
            sx={{ mt: 3, mr: 1 }}
            onClick={() => add(key)}
            aria-label={`add ${key}`}
          >
            {emoji}
          </Button>
        ))}
      </Box>
    </>
  );
}
