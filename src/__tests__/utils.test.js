import { sortWordsByPattern } from '../utils';
import words from './words';

test('sorts correctly', () => {
  const sorted = sortWordsByPattern(['happy'], words);
  const indices = sorted.map((w) => w.index);
  expect(indices).toStrictEqual([844, 268, 118, 61]);
});

test('sorts correctly: case-insensitive', () => {
  const sorted = sortWordsByPattern(['HAPPY'], words);
  const indices = sorted.map((w) => w.index);
  expect(indices).toStrictEqual([844, 268, 118, 61]);
});

test('sorts correctly: accents', () => {
  const sorted = sortWordsByPattern(['mec'], words);
  const indices = sorted.map((w) => w.index);
  expect(indices).toStrictEqual([61, 118, 844, 268]);
});
