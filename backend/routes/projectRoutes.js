const express = require('express');
const { createProject, getProjects, addProjectMember } = require('../controllers/projectController');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');

const router = express.Router();

router.use(authenticateToken);
router.post('/', authorizeRoles('ADMIN', 'MEMBER'), createProject);
router.get('/', getProjects);
router.patch('/:id/members', authorizeRoles('ADMIN', 'MEMBER'), addProjectMember);

module.exports = router;
