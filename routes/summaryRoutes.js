const express = require('express');
const router = express.Router();
const { getSummary } = require('../controllers/recordController');
const { requireRole } = require('../middleware/roleMiddleware');

router.get('/', requireRole('viewer', 'analyst', 'admin'), getSummary);

module.exports = router;
