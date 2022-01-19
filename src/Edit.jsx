import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

import { get, put, fetchDelete } from './utils';

export default function Edit() {
  const { level, index } = useParams();
  const [word, setWord] = useState('');
  const [yomigana, setYomigana] = useState('');
  const [meaning, setMeaning] = useState('');
  const navigate = useNavigate();

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
        navigate(`/search/${word.trim()}`);
      }
    );
  };

  const remove = () => {
    fetchDelete('/api/crud', { level, index }, () => {
      navigate(`/search/${word.trim()}`);
    });
  };

  return (
    <>
      <Typography variant="h5" mb={2}>
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
      <Box display="flex" justifyContent="space-between" mt={3}>
        <Button
          variant="contained"
          color="primary"
          onClick={edit}
          aria-label="edit"
        >
          edit
        </Button>
        <Button
          variant="contained"
          color="secondary"
          onClick={remove}
          aria-label="remove"
        >
          remove
        </Button>
      </Box>
    </>
  );
}
