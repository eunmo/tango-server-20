import React from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import { act, render, fireEvent, screen } from '@testing-library/react';
import Edit from '../edit';

const e = { word: 'a', yomigana: '', meaning: 'c' };
const f = { word: 'd', yomigana: 'e', meaning: 'f' };
const j = { word: 'g', yomigana: 'h', meaning: 'i' };
const wordMap = { E: e, F: f, J: j };

let optionBody = null;
let location = null;
beforeEach(() => {
  optionBody = null;
  jest.spyOn(global, 'fetch').mockImplementation((url, options) => {
    if (options) {
      optionBody = options.body;
      return Promise.resolve({ ok: true });
    }

    const index = '/api/search/'.length;
    const response = wordMap[url.substring(index, index + 1)] ?? {};
    return Promise.resolve({
      ok: true,
      json: () => Promise.resolve(response),
    });
  });
});

const renderLocation = ({ location: l }) => {
  location = l;
  return null;
};

const renderEdit = async (level, index) => {
  return act(async () => {
    render(
      <MemoryRouter initialEntries={[`/edit/${level}/${index}`]}>
        <Route path="*" render={renderLocation} />
        <Route path="/edit/:level/:index">
          <Edit />
        </Route>
      </MemoryRouter>
    );
  });
};

test.each(['E', 'F', 'J'])('get word', async (lang) => {
  const [level, index] = [`${lang}2001`, 1];
  const expected = wordMap[lang.toUpperCase()];

  await renderEdit(level, index);
  const { getByLabelText } = screen;
  expect(getByLabelText('word').value).toBe(expected.word);
  expect(getByLabelText('yomigana').value).toBe(expected.yomigana);
  expect(getByLabelText('meaning').value).toBe(expected.meaning);
});

test('edit word', async () => {
  const [level, index] = ['E2001', '1'];
  const [word, yomigana, meaning] = ['word', 'yomigana', 'meaning'];
  const editWord = { level, index, word, yomigana, meaning };

  await renderEdit(level, index);
  const { getByLabelText } = screen;
  fireEvent.change(getByLabelText('word'), { target: { value: word } });
  fireEvent.change(getByLabelText('yomigana'), { target: { value: yomigana } });
  fireEvent.change(getByLabelText('meaning'), { target: { value: meaning } });

  await act(async () => {
    fireEvent.click(getByLabelText('edit'));
  });

  expect(optionBody).toEqual(JSON.stringify(editWord));
  expect(location.pathname).toBe(`/search/${word}`);
});

test('delete word', async () => {
  const [level, index] = ['E2001', '1'];
  const deleteWord = { level, index };

  await renderEdit(level, index);
  const { getByLabelText } = screen;

  await act(async () => {
    fireEvent.click(getByLabelText('remove'));
  });

  expect(optionBody).toEqual(JSON.stringify(deleteWord));
  expect(location.pathname).toBe('/search/a');
});
