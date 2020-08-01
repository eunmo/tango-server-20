const express = require('express');
const { getNew, getLearningInLevel, getWord } = require('../db/query');

const router = express.Router();

router.get('/new', async (req, res) => {
  const words = await getNew();
  res.json(words);
});

router.get('/:level', async (req, res) => {
  const { level } = req.params;
  const words = await getLearningInLevel(level);
  res.json(words);
});

router.get('/:level/:index', async (req, res) => {
  const { level, index } = req.params;
  const word = await getWord(level, index);
  res.json(word);
});

module.exports = router;
