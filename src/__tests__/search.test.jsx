import React from 'react';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { MemoryRouter } from 'react-router-dom';
import { render, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import mediaQuery from 'css-mediaquery';
import Search from '../search';
import words from './words';

let queryCount = 0;
const server = setupServer(
  rest.get('/api/search/:keyword', (req, res, ctx) => {
    queryCount += 1;
    const { keyword } = req.params;
    if (keyword === 'happy') {
      return res(ctx.json({ patterns: ['happy'], words }));
    }

    return res(ctx.json({ patterns: [], words: [] }));
  })
);

beforeAll(() => server.listen());
beforeEach(() => {
  queryCount = 0;
});
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

function createMatchMedia(width) {
  return (query) => ({
    matches: mediaQuery.match(query, { width }),
    addListener: () => {},
    removeListener: () => {},
  });
}

const renderSearch = (width) => {
  window.matchMedia = createMatchMedia(width);
  return render(
    <MemoryRouter>
      <Search />
    </MemoryRouter>
  );
};

test('renders search box', () => {
  const { getByRole, getByPlaceholderText } = renderSearch(900);
  expect(getByRole('button', { name: 'search' })).toBeInTheDocument();
  expect(getByRole('button', { name: 'clear search' })).toBeInTheDocument();
  expect(getByPlaceholderText('Search Tango')).toBeInTheDocument();
});

test('prevents empty query', () => {
  const { getByRole } = renderSearch(900);
  const submit = getByRole('button', { name: 'search' });

  fireEvent.click(submit);

  expect(queryCount).toBe(0);
});

test('renders search results', async () => {
  const { getAllByRole, getByRole, getByPlaceholderText } = renderSearch(900);
  const textField = getByPlaceholderText('Search Tango');
  const submit = getByRole('button', { name: 'search' });

  fireEvent.change(textField, { target: { value: 'happy' } });
  fireEvent.click(submit);

  await waitFor(() => getByRole('table'));

  expect(getByRole('table')).toBeInTheDocument();

  const levels = getAllByRole('cell', { name: 'level' });
  const levelTexts = levels.map((l) => l.textContent);
  expect(levelTexts).toStrictEqual(['F1704', 'F1812', 'E1712', 'F1709']);
});

test('renders empty query', async () => {
  const { getByRole, getByPlaceholderText, queryByRole } = renderSearch(900);
  const textField = getByPlaceholderText('Search Tango');
  const submit = getByRole('button', { name: 'search' });

  fireEvent.change(textField, { target: { value: 'xxx' } });
  fireEvent.click(submit);

  await waitFor(() => getByRole('heading'));

  expect(getByRole('heading')).toBeInTheDocument();
  expect(queryByRole('table')).toBe(null);
});
