import { useLocation, MemoryRouter, Route, Routes } from 'react-router-dom';
import { act, render, fireEvent, screen } from '@testing-library/react';

import Add from '../Add';
import { getYYMM } from '../utils';

let optionBody = null;
let location = null;
beforeEach(() => {
  optionBody = null;
  jest.spyOn(window, 'fetch').mockImplementation((url, options) => {
    optionBody = options.body;
    return Promise.resolve({ ok: true });
  });
});

function RenderLocation() {
  location = useLocation();
  return null;
}

const renderAdd = async () => {
  return act(async () => {
    render(
      <MemoryRouter>
        <Routes>
          <Route path="*" element={<RenderLocation />} />
        </Routes>
        <Add />
      </MemoryRouter>
    );
  });
};

test.each([['E', 'F', 'J']])('add word', async (lang) => {
  const level = lang + getYYMM();
  const [word, yomigana, meaning] = ['word', 'yomigana', 'meaning'];
  const addWord = { level, word, yomigana, meaning };

  await renderAdd();
  const { getByLabelText } = screen;
  fireEvent.change(getByLabelText('word'), { target: { value: word } });
  fireEvent.change(getByLabelText('yomigana'), { target: { value: yomigana } });
  fireEvent.change(getByLabelText('meaning'), { target: { value: meaning } });

  await act(async () => {
    fireEvent.click(getByLabelText(`add ${lang}`));
  });

  expect(optionBody).toEqual(JSON.stringify(addWord));
  expect(location.pathname).toBe(`/search/${word}`);
});

test('trim word', async () => {
  const lang = 'E';
  const level = lang + getYYMM();
  const [word, yomigana, meaning] = ['word', 'yomigana', 'meaning'];
  const addWord = { level, word, yomigana, meaning };

  await renderAdd();
  const { getByLabelText } = screen;
  fireEvent.change(getByLabelText('word'), { target: { value: `${word} ` } });
  fireEvent.change(getByLabelText('yomigana'), {
    target: { value: `${yomigana} ` },
  });
  fireEvent.change(getByLabelText('meaning'), {
    target: { value: `${meaning} ` },
  });

  await act(async () => {
    fireEvent.click(getByLabelText(`add ${lang}`));
  });

  expect(optionBody).toEqual(JSON.stringify(addWord));
  expect(location.pathname).toBe(`/search/${word}`);
});

test.each([
  ['ほたるび [蛍火', '蛍火', 'ほたるび'],
  ['ほたるび [蛍火]', '蛍火', 'ほたるび'],
  ['西尾 維新（にしお いしん', '西尾維新', 'にしお いしん'],
  ['西尾 維新（にしお いしん）', '西尾維新', 'にしお いしん'],
])('split input', async (input, word, yomigana) => {
  await renderAdd();
  const { getByLabelText } = screen;
  fireEvent.change(getByLabelText('word'), { target: { value: input } });
  expect(getByLabelText('word').value).toBe(word);
  expect(getByLabelText('yomigana').value).toBe(yomigana);
});
