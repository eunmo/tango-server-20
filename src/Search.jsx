import React, { useEffect, useState } from 'react';
import InputBase from '@mui/material/InputBase';
import IconButton from '@mui/material/IconButton';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { Clear, Search as SearchIcon } from '@mui/icons-material';

import Words from './Words';
import { get, sortWordsByPattern } from './utils';

export default function Search({ initialValue, onChange = () => {} }) {
  const [keyword, setKeyword] = useState('');
  const [words, setWords] = useState([]);
  const [patterns, setPatterns] = useState(null);

  const search = (query) => {
    if (query !== '') {
      get(`/api/search/${query}`, ({ patterns: ps, words: ws }) => {
        setWords(sortWordsByPattern(ps, ws));
        setPatterns(ps);
      });
    }
  };

  useEffect(() => {
    const { initialKeyword = '' } = initialValue;
    setKeyword(initialKeyword);
    search(initialKeyword);
    setWords([]);
    setPatterns(null);
  }, [initialValue]);

  useEffect(() => {
    onChange(keyword);
  }, [keyword, onChange]);

  const submit = (e) => {
    e.preventDefault();
    search(keyword);
  };

  const clear = () => {
    setKeyword('');
    setWords([]);
    setPatterns(null);
  };

  return (
    <>
      <Paper
        component="form"
        variant="outlined"
        sx={{ p: 0.5, display: 'flex', flexGrow: 1 }}
        onSubmit={(e) => submit(e)}
      >
        <IconButton
          type="submit"
          sx={{ p: 1 }}
          aria-label="search"
          size="large"
        >
          <SearchIcon />
        </IconButton>
        <InputBase
          sx={{ flex: 1 }}
          placeholder="Search Tango"
          value={keyword}
          onChange={({ target }) => setKeyword(target.value)}
          inputProps={{ 'aria-label': 'search tango' }}
        />
        <IconButton
          sx={{ padding: 1 }}
          aria-label="clear search"
          onClick={clear}
          size="large"
        >
          <Clear />
        </IconButton>
      </Paper>
      {patterns && (
        <Typography variant="h6" m={2}>
          Search Result for: {patterns.join(', ')}
        </Typography>
      )}
      {words.length > 0 && <Words words={words} />}
    </>
  );
}
