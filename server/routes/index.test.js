const request = require('supertest');
const { prepare, cleanup } = require('../db/mock');
const app = require('../app');

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
  expect(body.length).toBe(3);
});

test.each([
  ['E2001', 3],
  ['F2001', 3],
  ['J2001', 3],
  ['E2002', 4],
  ['F2003', 4],
  ['N0', 0],
])('get words to learn in level %s', async (level, count) => {
  const body = await get(`/api/select/${level}`);
  expect(body.length).toBe(count);
});
