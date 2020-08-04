const { trimDate, getDateDiff } = require('../tz');

test.each([
  [660, new Date('2020-08-04T00:00:00.000Z')],
  [600, new Date('2020-08-04T00:00:00.000Z')],
  [540, new Date('2020-08-04T00:00:00.000Z')],
  [300, new Date('2020-08-04T00:00:00.000Z')],
  [240, new Date('2020-08-03T00:00:00.000Z')],
  [0, new Date('2020-08-03T00:00:00.000Z')],
  [-540, new Date('2020-08-03T00:00:00.000Z')],
])('trim tz %d', (timezone, expected) => {
  const trimmed = trimDate('2020-08-04T00:00:00.000Z', timezone);
  expect(trimmed).toStrictEqual(expected);
});

test.each([
  [600, 3],
  [300, 3],
  [0, 3],
  [-60, 3],
  [-120, 4],
  [-420, 4],
  [-480, 3],
  [-600, 3],
])('get date diff %d', (timezone, expected) => {
  const refDate = trimDate('2020-08-04T12:00:00.000Z', timezone);
  const hour = '2020-08-01T06:00:00.000Z';
  const diff = getDateDiff(hour, timezone, refDate);
  expect(diff).toBe(expected);
});
