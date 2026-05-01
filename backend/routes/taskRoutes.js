const express = require('express');
const { createTask, getTasks, updateTaskStatus } = require('../controllers/taskController');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');

const router = express.Router();

router.use(authenticateToken);
router.post('/', authorizeRoles('ADMIN', 'MEMBER'), createTask);
router.get('/', getTasks);
router.patch('/:id/status', authorizeRoles('ADMIN', 'MEMBER'), updateTaskStatus);

module.exports = router;
