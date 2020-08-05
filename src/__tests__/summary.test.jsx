import React from 'react';
import { act, render, fireEvent } from '@testing-library/react';

import Summary from '../summary';

const langs = {
  E: { learning: 1, learned: 10, fresh: 0 },
  F: { learning: 10, learned: 100, fresh: 1 },
};

const res1 = { langs, levels: [] };

let mockResponse;
beforeEach(() => {
  jest.spyOn(global, 'fetch').mockImplementation(() => {
    return Promise.resolve({
      ok: true,
      json: () => Promise.resolve(mockResponse),
    });
  });
});

test('renders langs', async () => {
  mockResponse = res1;
  let getByText;
  let getByRole;
  await act(async () => {
    ({ getByText, getByRole } = render(<Summary />));
  });
  const eBtn = getByRole('button', { name: 'E' });
  const fBtn = getByRole('button', { name: 'F' });

  expect(getByText('E')).toBeInTheDocument();
  expect(getByText('1')).toBeInTheDocument();
  expect(getByText('10')).toBeInTheDocument();

  expect(eBtn).toContainElement(getByText('E'));
  expect(eBtn).toContainElement(getByText('1'));
  expect(eBtn).toContainElement(getByText('10'));

  expect(getByText('F')).toBeInTheDocument();
  expect(getByText('10 [1]')).toBeInTheDocument();
  expect(getByText('100')).toBeInTheDocument();

  expect(fBtn).toContainElement(getByText('F'));
  expect(fBtn).toContainElement(getByText('10 [1]'));
  expect(fBtn).toContainElement(getByText('100'));
});

test('renders langs', async () => {
  mockResponse = res1;
  let getByRole;
  let getByLabelText;
  await act(async () => {
    ({ getByRole, getByLabelText } = render(<Summary />));
  });

  const eBtn = getByRole('button', { name: 'E' });
  const fBtn = getByRole('button', { name: 'F' });
  expect(eBtn).toBeInTheDocument();
  expect(fBtn).toBeInTheDocument();
  const eAvatar = getByLabelText('Avatar-E');
  const fAvatar = getByLabelText('Avatar-F');
  expect(eAvatar).toBeInTheDocument();
  expect(fAvatar).toBeInTheDocument();

  const normalColor = { backgroundColor: 'rgb(189, 189, 189)' };
  const selectedColor = { backgroundColor: 'rgb(255, 87, 34)' };

  expect(eAvatar).toHaveStyle(normalColor);
  expect(fAvatar).toHaveStyle(normalColor);

  fireEvent.click(eBtn);

  expect(eAvatar).toHaveStyle(selectedColor);
  expect(fAvatar).toHaveStyle(normalColor);

  fireEvent.click(eBtn);

  expect(eAvatar).toHaveStyle(normalColor);
  expect(fAvatar).toHaveStyle(normalColor);

  fireEvent.click(eBtn);

  expect(eAvatar).toHaveStyle(selectedColor);
  expect(fAvatar).toHaveStyle(normalColor);

  fireEvent.click(fBtn);

  expect(eAvatar).toHaveStyle(normalColor);
  expect(fAvatar).toHaveStyle(selectedColor);
});

const levelsShort = [
  { level: 'E2008', summary: [[1, 1, 1]] },
  {
    level: 'F2008',
    summary: [
      [0, 0, 1],
      [1, 1, 3],
      [2, 1, 3],
      [2, 2, 3],
    ],
  },
];
const res2 = { langs, levels: levelsShort };

test('renders short levels', async () => {
  mockResponse = res2;
  let getByText;
  let getByTestId;
  await act(async () => {
    ({ getByText, getByTestId } = render(<Summary />));
  });

  expect(getByText('2008')).toBeInTheDocument();
  expect(getByTestId('M-2008-8').textContent).toBe('6');
  expect(getByTestId('M-2008-9').textContent).toBe('5');

  expect(getByTestId('D-0').textContent).toBe('1');
  expect(getByTestId('D-0-9').textContent).toBe('1');
  expect(getByTestId('D-1').textContent).toBe('7');
  expect(getByTestId('D-1-8').textContent).toBe('3');
  expect(getByTestId('D-1-9').textContent).toBe('4');
  expect(getByTestId('D-2').textContent).toBe('3');
  expect(getByTestId('D-2-8').textContent).toBe('3');
});

test('renders short levels filter by lang', async () => {
  mockResponse = res2;
  let getByRole;
  let getByTestId;
  await act(async () => {
    ({ getByRole, getByTestId } = render(<Summary />));
  });

  const eBtn = getByRole('button', { name: 'E' });
  const fBtn = getByRole('button', { name: 'F' });

  fireEvent.click(eBtn);

  expect(getByTestId('M-2008-8').textContent).toBe('');
  expect(getByTestId('M-2008-9').textContent).toBe('1');

  expect(getByTestId('D-0').textContent).toBe('0');
  expect(getByTestId('D-0-9').textContent).toBe('');
  expect(getByTestId('D-1').textContent).toBe('1');
  expect(getByTestId('D-1-8').textContent).toBe('');
  expect(getByTestId('D-1-9').textContent).toBe('1');
  expect(getByTestId('D-2').textContent).toBe('0');
  expect(getByTestId('D-2-8').textContent).toBe('');

  fireEvent.click(fBtn);

  expect(getByTestId('M-2008-8').textContent).toBe('6');
  expect(getByTestId('M-2008-9').textContent).toBe('4');

  expect(getByTestId('D-0').textContent).toBe('1');
  expect(getByTestId('D-0-9').textContent).toBe('1');
  expect(getByTestId('D-1').textContent).toBe('6');
  expect(getByTestId('D-1-8').textContent).toBe('3');
  expect(getByTestId('D-1-9').textContent).toBe('3');
  expect(getByTestId('D-2').textContent).toBe('3');
  expect(getByTestId('D-2-8').textContent).toBe('3');
});

const levelsLong = [
  { level: 'E2001', summary: [[1, 1, 1]] },
  { level: 'E2002', summary: [[1, 1, 1]] },
  { level: 'E2003', summary: [[1, 1, 1]] },
  { level: 'E2004', summary: [[1, 1, 1]] },
  { level: 'E2005', summary: [[1, 1, 1]] },
  { level: 'E2006', summary: [[1, 1, 1]] },
  { level: 'E2007', summary: [[1, 1, 1]] },
  { level: 'E2008', summary: [[1, 1, 1]] },
  { level: 'E2009', summary: [[1, 1, 1]] },
  { level: 'E2010', summary: [[1, 1, 1]] },
  { level: 'E2011', summary: [[1, 1, 1]] },
  { level: 'E2012', summary: [[1, 1, 1]] },
];
const res3 = { langs, levels: levelsLong };

test('renders long levels', async () => {
  mockResponse = res3;
  let queryByText;
  let getByTestId;
  await act(async () => {
    ({ queryByText, getByTestId } = render(<Summary />));
  });

  expect(queryByText('2001')).toBe(null);
  expect(queryByText('2002')).toBe(null);
  expect(queryByText('2003')).toBe(null);
  expect(queryByText('Old')).toBeInTheDocument();
  expect(queryByText('2004')).toBeInTheDocument();
  expect(queryByText('2005')).toBeInTheDocument();
  expect(queryByText('2006')).toBeInTheDocument();
  expect(queryByText('2007')).toBeInTheDocument();
  expect(queryByText('2008')).toBeInTheDocument();
  expect(queryByText('2009')).toBeInTheDocument();
  expect(queryByText('2010')).toBeInTheDocument();
  expect(queryByText('2011')).toBeInTheDocument();
  expect(queryByText('2012')).toBeInTheDocument();

  expect(getByTestId('M-Old-9').textContent).toBe('3');
});
