const { dml, query, cleanup } = require('@eunmo/mysql');
const { add, edit, remove, sync } = require('.');

beforeAll(async () => {
  await dml('DROP TABLE IF EXISTS words;');
  await dml('CREATE TABLE words LIKE tango.words;');
});

afterAll(async () => {
  await dml('DROP TABLE IF EXISTS words;');
  await cleanup();
});

beforeEach(async () => {
  await dml('TRUNCATE TABLE words;');
});

test('insert one', async () => {
  const [level, word, yomigana, meaning] = 'abcd'.split('');
  await add(level, word, yomigana, meaning);
  const rows = await query('SELECT * FROM words');
  expect(rows.length).toBe(1);
});

test('insert two', async () => {
  const [level, word, yomigana, meaning] = 'abcd'.split('');
  await add(level, word, yomigana, meaning);
  await add(level, word, yomigana, meaning);
  const rows = await query('SELECT `index` FROM words ORDER BY level, `index`');
  expect(rows.length).toBe(2);
  expect(rows.map((r) => r.index)).toStrictEqual([1, 2]);
});

test('insert then update one', async () => {
  let [level, word, yomigana, meaning] = 'abcd'.split('');
  await add(level, word, yomigana, meaning);
  [level, word, yomigana, meaning] = 'aBCD'.split('');
  await edit(level, 1, word, yomigana, meaning);
  const rows = await query('SELECT * FROM words');
  expect(rows.length).toBe(1);
  const row = rows[0];
  expect(row.word).toBe(word);
  expect(row.yomigana).toBe(yomigana);
  expect(row.meaning).toBe(meaning);
});

test('insert then delete one', async () => {
  const [level, word, yomigana, meaning] = 'abcd'.split('');
  await add(level, word, yomigana, meaning);
  let rows = await query('SELECT * FROM words');
  expect(rows.length).toBe(1);
  await remove(level, 1);
  rows = await query('SELECT * FROM words');
  expect(rows.length).toBe(0);
});

test('insert one then sync', async () => {
  const [level, word, yomigana, meaning] = 'abcd'.split('');
  await add(level, word, yomigana, meaning);
  const [streak, lastCorrect] = [1, '2020-07-12T22:15:12.000Z'];
  await sync([{ level, index: 1, streak, lastCorrect }]);
  const rows = await query('SELECT * FROM words');
  expect(rows.length).toBe(1);
  const row = rows[0];
  expect(row.streak).toBe(streak);
  expect(row.lastCorrect).toStrictEqual(new Date(lastCorrect));
});

test('insert two then sync', async () => {
  const [level, word, yomigana, meaning] = 'abcd'.split('');
  await add(level, word, yomigana, meaning);
  await add(level, word, yomigana, meaning);
  const [streak, lastCorrect] = [1, '2020-07-12T22:15:12.000Z'];
  await sync([
    { level, index: 1, streak, lastCorrect },
    { level, index: 2, streak: streak + 1, lastCorrect },
  ]);
  const rows = await query('SELECT * FROM words');
  expect(rows.length).toBe(2);
  rows.forEach((row, index) => {
    expect(row.streak).toBe(streak + index);
    expect(row.lastCorrect).toStrictEqual(new Date(lastCorrect));
  });
});

test('empty sync', async () => {
  await sync([]);
});
