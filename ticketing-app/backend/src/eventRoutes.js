const express = require('express');
const { createEvent, getEvents } = require('./eventControllers');

const router = express.Router();

router.get('/', getEvents);
router.post('/', createEvent);

module.exports = router;
