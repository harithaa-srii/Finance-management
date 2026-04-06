const express = require('express');
const router = express.Router();
const { createUser, getUsers, updateUser, deleteUser, getUserBalance } = require('../controllers/userController');
const { requireRole } = require('../middleware/roleMiddleware');

router.post("/", createUser);
router.get("/", requireRole('admin'), getUsers);
router.get("/:id/balance", requireRole('viewer', 'analyst', 'admin'), getUserBalance);
router.put("/:id", requireRole('admin'), updateUser);
router.delete("/:id", requireRole('admin'), deleteUser);

module.exports = router;