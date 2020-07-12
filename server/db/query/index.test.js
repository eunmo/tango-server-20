const { dml, cleanup } = require('@eunmo/mysql');
const { add, sync } = require('../dml');
const {
  getNew,
  getLearning,
  getLearningInLevel,
  getLangSummary,
  getSummary,
} = require('.');

const lastCorrect = '2020-07-12T22:15:12.000Z';

beforeAll(async () => {
  await dml('DROP TABLE IF EXISTS words;');
  await dml('CREATE TABLE words LIKE tango.words;');
  for (let i = 1; i < 4; i += 1) {
    for (let j = 0; j < 4; j += 1) {
      await add(`E200${i}`, 'a', 'a', 'a'); // eslint-disable-line no-await-in-loop
      await add(`F200${i}`, 'b', 'b', 'b'); // eslint-disable-line no-await-in-loop
      await add(`J200${i}`, 'c', 'c', 'c'); // eslint-disable-line no-await-in-loop
    }
  }
  let words = [];
  'EFJ'.split('').forEach((lang) => {
    words = words.concat([
      { level: `${lang}2001`, index: 1, streak: 11, lastCorrect },
      { level: `${lang}2001`, index: 2, streak: 10, lastCorrect },
      { level: `${lang}2001`, index: 3, streak: 9, lastCorrect },
      { level: `${lang}2001`, index: 4, streak: 8, lastCorrect },
      { level: `${lang}2002`, index: 1, streak: 7, lastCorrect },
      { level: `${lang}2002`, index: 2, streak: 6, lastCorrect },
      { level: `${lang}2002`, index: 3, streak: 5, lastCorrect },
      { level: `${lang}2002`, index: 4, streak: 4, lastCorrect },
      { level: `${lang}2003`, index: 1, streak: 3, lastCorrect },
      { level: `${lang}2003`, index: 2, streak: 2, lastCorrect },
      { level: `${lang}2003`, index: 3, streak: 1, lastCorrect },
    ]);
  });
  await sync(words);
});

afterAll(async () => {
  await dml('DROP TABLE IF EXISTS words;');
  await cleanup();
});

test('get new words', async () => {
  const rows = await getNew();
  expect(rows.length).toBe(3);
});

test('get words to learn', async () => {
  const rows = await getLearning();
  expect(rows.length).toBe(33);
});

test('get words to learn in level', async () => {
  let rows = await getLearningInLevel('E2001');
  expect(rows.length).toBe(3);
  rows = await getLearningInLevel('E2003');
  expect(rows.length).toBe(4);
});

test('get language summary', async () => {
  const rows = await getLangSummary();
  expect(rows.length).toBe(36);
});

test('get summary', async () => {
  const rows = await getSummary();
  expect(rows.length).toBe(33);
});
