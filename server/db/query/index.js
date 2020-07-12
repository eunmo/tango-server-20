const { query } = require('@eunmo/mysql');

const getNew = () => {
  return query('SELECT * FROM words WHERE lastCorrect IS NULL');
};

const getLearning = () => {
  return query('SELECT * FROM words WHERE streak < 11 ORDER BY level, `index`');
};

const getLearningInLevel = (level) => {
  return query(`
    SELECT *
      FROM words
     WHERE level='${level}'
       AND streak < 11
  ORDER BY level, \`index\``);
};

const getLangSummary = async () => {
  return query(`
    SELECT SUBSTR(level, 1, 1) as lang, streak, count(*) as count
      FROM words
  GROUP BY lang, streak`);
};

const getSummary = async () => {
  return query(`
    SELECT SUBSTR(level, 1, 1) as lang, streak, lastCorrect
      FROM words
     WHERE streak < 11`);
};

module.exports = {
  getNew,
  getLearning,
  getLearningInLevel,
  getLangSummary,
  getSummary,
};
