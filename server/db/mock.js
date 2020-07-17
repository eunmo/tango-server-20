const { dml, cleanup: dbCleanup } = require('@eunmo/mysql');
const { add, sync } = require('./dml');

const lastCorrect = '2020-07-12T22:15:12.000Z';

const prepare = async () => {
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
};

const cleanup = async () => {
  await dml('DROP TABLE IF EXISTS words;');
  await dbCleanup();
};

module.exports = { prepare, cleanup };
