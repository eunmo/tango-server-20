const express = require('express');
const { sync } = require('../db/dml');
const { getLearning } = require('../db/query');

const router = express.Router();

router.put('/', async (req, res) => {
  const words = req.body;
  let learning = await getLearning();

  const learningMap = {};
  learning.forEach((word) => {
    const { level, index } = word;
    learningMap[level + index] = word;
  });

  const toSync = [];
  words
    .filter((word) => word.streak > 0)
    .forEach((word) => {
      const { level, index, streak, lastCorrect } = word;
      const match = learningMap[level + index];
      if (match === undefined) {
        return;
      }

      if (match.lastCorrect?.toISOString() !== lastCorrect) {
        toSync.push({ level, index, streak, lastCorrect });
      }
    });

  await sync(toSync);
  if (toSync.length > 0) {
    learning = await getLearning();
  }

  res.json(learning);
});

module.exports = router;
