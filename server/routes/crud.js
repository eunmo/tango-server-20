const express = require('express');
const { add, edit, remove } = require('../db/dml');

const router = express.Router();

router.post('/', async (req, res) => {
  const { level, word, yomigana, meaning } = req.body;
  await add(level, word, yomigana, meaning);
  res.sendStatus(200);
});

router.put('/', async (req, res) => {
  const { level, index, word, yomigana, meaning } = req.body;
  await edit(level, index, word, yomigana, meaning);
  res.sendStatus(200);
});

router.delete('/', async (req, res) => {
  const { level, index } = req.body;
  await remove(level, index);
  res.sendStatus(200);
});

module.exports = router;
