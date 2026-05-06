const express = require('express');
const { body, param } = require('express-validator');
const { validateRequest } = require('../middleware/validate');
const { authenticateJWT } = require('../middleware/auth');
const { requireProjectMember, requireAdmin } = require('../middleware/role');
const { 
  getMembers, 
  addMember, 
  updateMemberRole, 
  removeMember 
} = require('../controllers/team');

// mergeParams allows access to route parameters defined in the parent router
// e.g. /projects/:id/members
const router = express.Router({ mergeParams: true });

router.use(authenticateJWT);

router.get('/', [
  param('id').isUUID().withMessage('Invalid project ID format'),
  validateRequest,
  requireProjectMember
], getMembers);

router.post('/', [
  param('id').isUUID().withMessage('Invalid project ID format'),
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Must be a valid email address'),
  body('role')
    .optional()
    .isIn(['admin', 'member']).withMessage('Role must be either admin or member'),
  validateRequest,
  requireProjectMember,
  requireAdmin
], addMember);

router.patch('/:userId/role', [
  param('id').isUUID().withMessage('Invalid project ID format'),
  param('userId').isUUID().withMessage('Invalid user ID format'),
  body('role')
    .notEmpty().withMessage('Role is required')
    .isIn(['admin', 'member']).withMessage('Role must be either admin or member'),
  validateRequest,
  requireProjectMember,
  requireAdmin
], updateMemberRole);

router.delete('/:userId', [
  param('id').isUUID().withMessage('Invalid project ID format'),
  param('userId').isUUID().withMessage('Invalid user ID format'),
  validateRequest,
  requireProjectMember,
  requireAdmin
], removeMember);

module.exports = router;
