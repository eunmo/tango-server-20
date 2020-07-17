const express = require('express');

const select = require('./select');

const router = express.Router();
router.use('/select', select);

module.exports = router;
