const express = require('express');
const { getMatch } = require('../db/query');

const router = express.Router();

router.get('/:keyword', async (req, res) => {
  const { keyword } = req.params;
  const patterns = keyword
    .split(/[[（·]/)
    .map((e) => e.replace(']', '').replace('）', '').trim());
  const words = await getMatch(patterns);
  res.json(words);
});

module.exports = router;
