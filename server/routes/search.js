const express = require('express');
const { getMatch } = require('../db/query');

const router = express.Router();

const filter = {
  f: false,
  m: false,
  mf: false,
  fpl: false,
  mpl: false,
};

router.get('/:keyword', async (req, res) => {
  const { keyword } = req.params;
  const patterns = keyword
    .split(/[[（·]/)
    .map((e) => e.replace(']', '').replace('）', '').trim())
    .filter((e) => filter[e] ?? true);
  let words = [];
  if (patterns.length > 0) {
    words = await getMatch(patterns);
  }
  res.json({ patterns, words });
});

module.exports = router;
