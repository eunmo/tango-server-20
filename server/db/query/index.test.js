const { prepare, cleanup } = require('../mock');
const {
  getNew,
  getLearning,
  getLearningInLevel,
  getLangSummary,
  getSummary,
  getMatch,
} = require('.');

beforeAll(async () => {
  await prepare();
});

afterAll(async () => {
  await cleanup();
});

test('get new words', async () => {
  const rows = await getNew();
  expect(rows.length).toBe(9);
});

test('get words to learn', async () => {
  const rows = await getLearning();
  expect(rows.length).toBe(42);
});

test('get words to learn in level', async () => {
  let rows = await getLearningInLevel('E2001');
  expect(rows.length).toBe(4);
  rows = await getLearningInLevel('E2003');
  expect(rows.length).toBe(5);
});

test('get language summary', async () => {
  const rows = await getLangSummary();
  expect(rows.length).toBe(37);
});

test('get summary', async () => {
  const rows = await getSummary();
  expect(rows.length).toBe(33);
});

test.each([
  [['a'], 15],
  [['a', 'b'], 15],
  [['a', 'd'], 30],
])('get match', async (patterns, count) => {
  const rows = await getMatch(patterns);
  expect(rows.length).toBe(count);
});
