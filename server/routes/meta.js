const express = require('express');
const { getLangSummary, getSummary } = require('../db/query');

const router = express.Router();

router.get('/', async (req, res) => {
  const [langSummary, summary] = await Promise.all([
    getLangSummary(),
    getSummary(),
  ]);

  const langs = {};
  langSummary.forEach(({ lang, streak, count }) => {
    const key = { N: 'J' }[lang] ?? lang;
    if (langs[key] === undefined) {
      langs[key] = { learned: 0, learning: 0, new: 0 };
    }

    if (streak === 11) {
      langs[key].learned += count;
    } else {
      langs[key].learning += count;
      if (streak === 0) {
        langs[key].new = count;
      }
    }
  });

  res.json({ langs, summary });
});

module.exports = router;
