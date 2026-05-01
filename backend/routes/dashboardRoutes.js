const express = require('express');
const { getDashboard, getAdminDashboard } = require('../controllers/dashboardController');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');

const router = express.Router();

router.get('/', authenticateToken, getDashboard);
router.get('/admin', authenticateToken, authorizeRoles('ADMIN'), getAdminDashboard);

module.exports = router;
