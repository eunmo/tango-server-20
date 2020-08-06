const express = require('express');
const { getLangSummary, getSummary } = require('../db/query');
const { trimDate, getDateDiff } = require('./tz');
const { getNow } = require('./util');

const router = express.Router();

router.get('/:tzOffset', async (req, res) => {
  const { tzOffset } = req.params;
  const timezone = Number(tzOffset);

  const [langSummary, hourSummary] = await Promise.all([
    getLangSummary(),
    getSummary(),
  ]);

  const langs = {};
  langSummary.forEach(({ lang, streak, count }) => {
    const key = { N: 'J' }[lang] ?? lang;
    if (langs[key] === undefined) {
      langs[key] = { learned: 0, learning: 0, fresh: 0 };
    }

    langs[key].learned += count;
    if (streak <= 10) {
      langs[key].learning += count;
      if (streak === 0) {
        langs[key].fresh = count;
      }
    }
  });

  const summary = [];
  const refDate = trimDate(getNow(), timezone);
  hourSummary.forEach(({ level, streak, hour, count }) => {
    const diff = getDateDiff(hour, timezone, refDate);
    const last = summary[summary.length - 1] ?? {};
    if (last.level === level && last.streak === streak && last.diff === diff) {
      last.count += count;
    } else {
      summary.push({ level, streak, count, diff });
    }
  });

  const levels = {};
  summary.forEach(({ level, streak, count, diff }) => {
    if (levels[level] === undefined) {
      levels[level] = { level, summary: [] };
    }
    levels[level].summary.push([streak, Math.max(0, streak - diff), count]);
  });

  res.json({ langs, levels: Object.values(levels) });
});

module.exports = router;
