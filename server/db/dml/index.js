const { dml, queryOne } = require('@eunmo/mysql');

function formatDate(date) {
  const time = new Date(date);
  return time.toISOString().slice(0, 19).replace('T', ' ');
}

const add = async (level, word, yomigana, meaning) => {
  const { newid } = await queryOne(
    `SELECT COALESCE(MAX(\`index\`),0) + 1 as newid
       FROM words
      WHERE level = ?`,
    level
  );

  return dml(
    'INSERT INTO words (level, `index`, word, yomigana, meaning) VALUES (?)',
    [[level, newid, word, yomigana, meaning]]
  );
};

const edit = (level, index, word, yomigana, meaning) => {
  return dml(
    `UPDATE words
        SET word = ?, yomigana = ?, meaning = ?
      WHERE level = ?
        AND \`index\`= ?`,
    [word, yomigana, meaning, level, index]
  );
};

const remove = (level, index) => {
  const values = [level, index];
  return dml('DELETE FROM words WHERE level = ? AND `index` = ?', values);
};

const sync = (words) => {
  if (words.length === 0) {
    return Promise.resolve();
  }

  const vals = words
    .map(
      ({ level, index, streak, lastCorrect }) =>
        `SELECT
    '${level}' as level,
    ${index} as _index,
    ${streak} as streak,
    '${formatDate(lastCorrect)}' as lastCorrect`
    )
    .join(' UNION ');

  return dml(`
    UPDATE words, (${vals}) vals
       SET words.streak=vals.streak, words.lastCorrect=vals.lastCorrect
     WHERE words.level=vals.level
       AND words.\`index\`=vals._index`);
};

module.exports = { add, edit, remove, sync };
