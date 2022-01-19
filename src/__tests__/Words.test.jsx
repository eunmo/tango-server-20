import { MemoryRouter } from 'react-router-dom';
import { render } from '@testing-library/react';
import mediaQuery from 'css-mediaquery';

import Words from '../Words';

function createMatchMedia(width) {
  return (query) => ({
    matches: mediaQuery.match(query, { width }),
    addListener: () => {},
    removeListener: () => {},
  });
}

const words = [
  {
    level: 'E2001',
    index: 1,
    streak: 4,
    word: 'a',
    yomigana: '',
    meaning: 'c',
  },
  {
    level: 'F2001',
    index: 2,
    streak: 5,
    word: 'd',
    yomigana: '',
    meaning: 'f',
  },
  {
    level: 'J2001',
    index: 3,
    streak: 6,
    word: 'g',
    yomigana: 'h',
    meaning: 'i',
  },
];

const renderWords = (width) => {
  window.matchMedia = createMatchMedia(width);
  const { getByText, queryByText } = render(
    <MemoryRouter>
      <Words words={words} />
    </MemoryRouter>
  );
  return { getByText, queryByText };
};

test('renders for large screens', () => {
  const { getByText } = renderWords(900);
  '123456acdfghi'.split('').forEach((d) => {
    expect(getByText(d, { exact: true })).toBeInTheDocument();
  });
});

test('renders for small screens', () => {
  const { getByText, queryByText } = renderWords(300);
  '123456'.split('').forEach((d) => {
    expect(queryByText(d, { exact: true })).toBe(null);
  });
  'acdfghi'.split('').forEach((d) => {
    expect(getByText(d, { exact: true })).toBeInTheDocument();
  });
});
