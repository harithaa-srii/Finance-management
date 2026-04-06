const express = require('express');
const router = express.Router();
const { createRecord, getRecords, updateRecord, deleteRecord } = require('../controllers/recordController');
const { requireRole } = require('../middleware/roleMiddleware');

router.post("/", requireRole('admin','analyst'), createRecord);
router.get("/", requireRole('analyst', 'admin'), getRecords);
router.put("/:id", requireRole('admin','analyst'), updateRecord);
router.delete("/:id", requireRole('admin'), deleteRecord);

module.exports = router;