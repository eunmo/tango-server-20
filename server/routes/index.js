const express = require('express');

const meta = require('./meta');
const search = require('./search');
const select = require('./select');

const crud = require('./crud');
const sync = require('./sync');

const router = express.Router();
router.use('/meta', meta);
router.use('/search', search);
router.use('/select', select);

router.use('/crud', crud);
router.use('/sync', sync);

module.exports = router;
