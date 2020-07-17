const request = require('supertest');
const { prepare, cleanup } = require('../../db/mock');
const app = require('../../app');

beforeAll(async () => {
  await prepare();
});

afterAll(async () => {
  await cleanup();
});

const get = async (url) => {
  const response = await request(app).get(url);
  expect(response.statusCode).toBe(200);

  const { body } = response;
  return body;
};

test('get new words', async () => {
  const body = await get('/api/select/new');
  expect(body.length).toBe(9);
});

test.each([
  ['E2001', 4],
  ['F2001', 4],
  ['J2001', 4],
  ['E2002', 5],
  ['F2003', 5],
  ['N0', 0],
])('get words to learn in level %s', async (level, count) => {
  const body = await get(`/api/select/${level}`);
  expect(body.length).toBe(count);
});

test('get meta', async () => {
  const { langs, summary } = await get('/api/meta');
  expect(langs).toStrictEqual({
    E: { learned: 1, learning: 14, new: 3 },
    F: { learned: 1, learning: 14, new: 3 },
    J: { learned: 2, learning: 14, new: 3 },
  });
  expect(summary).toStrictEqual([
    { lang: 'E', streak: 0, hour: null, count: 3 },
    { lang: 'E', streak: 1, hour: '2020-07-12T22:00:00.000Z', count: 2 },
    { lang: 'E', streak: 2, hour: '2020-07-12T22:00:00.000Z', count: 1 },
    { lang: 'E', streak: 3, hour: '2020-07-12T22:00:00.000Z', count: 1 },
    { lang: 'E', streak: 4, hour: '2020-07-12T22:00:00.000Z', count: 1 },
    { lang: 'E', streak: 5, hour: '2020-07-12T22:00:00.000Z', count: 1 },
    { lang: 'E', streak: 6, hour: '2020-07-12T22:00:00.000Z', count: 1 },
    { lang: 'E', streak: 7, hour: '2020-07-12T22:00:00.000Z', count: 1 },
    { lang: 'E', streak: 8, hour: '2020-07-12T22:00:00.000Z', count: 1 },
    { lang: 'E', streak: 9, hour: '2020-07-12T22:00:00.000Z', count: 1 },
    { lang: 'E', streak: 10, hour: '2020-07-12T22:00:00.000Z', count: 1 },
    { lang: 'F', streak: 0, hour: null, count: 3 },
    { lang: 'F', streak: 1, hour: '2020-07-12T22:00:00.000Z', count: 2 },
    { lang: 'F', streak: 2, hour: '2020-07-12T22:00:00.000Z', count: 1 },
    { lang: 'F', streak: 3, hour: '2020-07-12T22:00:00.000Z', count: 1 },
    { lang: 'F', streak: 4, hour: '2020-07-12T22:00:00.000Z', count: 1 },
    { lang: 'F', streak: 5, hour: '2020-07-12T22:00:00.000Z', count: 1 },
    { lang: 'F', streak: 6, hour: '2020-07-12T22:00:00.000Z', count: 1 },
    { lang: 'F', streak: 7, hour: '2020-07-12T22:00:00.000Z', count: 1 },
    { lang: 'F', streak: 8, hour: '2020-07-12T22:00:00.000Z', count: 1 },
    { lang: 'F', streak: 9, hour: '2020-07-12T22:00:00.000Z', count: 1 },
    { lang: 'F', streak: 10, hour: '2020-07-12T22:00:00.000Z', count: 1 },
    { lang: 'J', streak: 0, hour: null, count: 3 },
    { lang: 'J', streak: 1, hour: '2020-07-12T22:00:00.000Z', count: 2 },
    { lang: 'J', streak: 2, hour: '2020-07-12T22:00:00.000Z', count: 1 },
    { lang: 'J', streak: 3, hour: '2020-07-12T22:00:00.000Z', count: 1 },
    { lang: 'J', streak: 4, hour: '2020-07-12T22:00:00.000Z', count: 1 },
    { lang: 'J', streak: 5, hour: '2020-07-12T22:00:00.000Z', count: 1 },
    { lang: 'J', streak: 6, hour: '2020-07-12T22:00:00.000Z', count: 1 },
    { lang: 'J', streak: 7, hour: '2020-07-12T22:00:00.000Z', count: 1 },
    { lang: 'J', streak: 8, hour: '2020-07-12T22:00:00.000Z', count: 1 },
    { lang: 'J', streak: 9, hour: '2020-07-12T22:00:00.000Z', count: 1 },
    { lang: 'J', streak: 10, hour: '2020-07-12T22:00:00.000Z', count: 1 },
  ]);
});

test.each([
  ['a', 15],
  ['a[b', 15],
  ['x[b', 15],
  ['x（b', 15],
  ['a[b]', 15],
  ['x[b]', 15],
  ['x（b）', 15],
  ['x·b', 15],
  ['a·d', 30],
])('search %s', async (pattern, count) => {
  const body = await get(encodeURI(`/api/search/${pattern}`));
  expect(body.length).toBe(count);
});
