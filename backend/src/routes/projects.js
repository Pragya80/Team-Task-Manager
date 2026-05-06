const express = require('express');
const { body, param } = require('express-validator');
const { validateRequest } = require('../middleware/validate');
const { authenticateJWT } = require('../middleware/auth');
const { requireProjectMember, requireAdmin } = require('../middleware/role');
const { 
  getAllProjects, 
  createProject, 
  getProjectById, 
  updateProject, 
  deleteProject 
} = require('../controllers/projects');

const router = express.Router();

// All project routes require authentication
router.use(authenticateJWT);

router.get('/', getAllProjects);

router.post('/', [
  body('name')
    .trim()
    .notEmpty().withMessage('Project name is required')
    .isLength({ min: 3, max: 100 }).withMessage('Name must be between 3 and 100 characters'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 }).withMessage('Description cannot exceed 500 characters'),
  validateRequest
], createProject);

router.get('/:id', [
  param('id').isUUID().withMessage('Invalid project ID format'),
  validateRequest,
  requireProjectMember
], getProjectById);

router.put('/:id', [
  param('id').isUUID().withMessage('Invalid project ID format'),
  body('name')
    .optional()
    .trim()
    .isLength({ min: 3, max: 100 }).withMessage('Name must be between 3 and 100 characters'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 }).withMessage('Description cannot exceed 500 characters'),
  validateRequest,
  requireProjectMember,
  requireAdmin
], updateProject);

router.delete('/:id', [
  param('id').isUUID().withMessage('Invalid project ID format'),
  validateRequest,
  requireProjectMember,
  requireAdmin
], deleteProject);

module.exports = router;
