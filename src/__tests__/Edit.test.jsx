import React from 'react';
import { useLocation, MemoryRouter, Route, Routes } from 'react-router-dom';
import { act, render, fireEvent, screen } from '@testing-library/react';

import Edit from '../Edit';

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
    const response = wordMap[url.slice(index, index + 1)] ?? {};
    return Promise.resolve({
      ok: true,
      json: () => Promise.resolve(response),
    });
  });
});

function RenderLocation() {
  location = useLocation();
  return null;
}

const renderEdit = async (level, index) => {
  return act(async () => {
    render(
      <MemoryRouter initialEntries={[`/edit/${level}/${index}`]}>
        <Routes>
          <Route path="*" element={<RenderLocation />} />
          <Route path="/edit/:level/:index" element={<Edit />} />
        </Routes>
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

test('trim word', async () => {
  const [level, index] = ['E2001', '1'];
  const [word, yomigana, meaning] = ['word', 'yomigana', 'meaning'];
  const editWord = { level, index, word, yomigana, meaning };

  await renderEdit(level, index);
  const { getByLabelText } = screen;
  fireEvent.change(getByLabelText('word'), { target: { value: `${word} ` } });
  fireEvent.change(getByLabelText('yomigana'), {
    target: { value: `${yomigana} ` },
  });
  fireEvent.change(getByLabelText('meaning'), {
    target: { value: `${meaning} ` },
  });

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
