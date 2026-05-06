const express = require('express');
const { param } = require('express-validator');
const { validateRequest } = require('../middleware/validate');
const { authenticateJWT } = require('../middleware/auth');
const { requireProjectMember } = require('../middleware/role');
const { getDashboardStats } = require('../controllers/dashboard');

const router = express.Router({ mergeParams: true });

router.use(authenticateJWT);

router.get('/', [
  param('id').isUUID().withMessage('Invalid project ID format'),
  validateRequest,
  requireProjectMember
], getDashboardStats);

module.exports = router;
