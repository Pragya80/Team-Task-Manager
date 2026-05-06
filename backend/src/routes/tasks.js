const express = require('express');
const { body, param, query } = require('express-validator');
const { validateRequest } = require('../middleware/validate');
const { authenticateJWT } = require('../middleware/auth');
const { requireProjectMember, requireAdmin } = require('../middleware/role');
const { 
  getTasks, 
  createTask, 
  getTaskById, 
  updateTask, 
  updateTaskStatus, 
  deleteTask 
} = require('../controllers/tasks');

const router = express.Router({ mergeParams: true });

router.use(authenticateJWT);

router.get('/', [
  param('id').isUUID().withMessage('Invalid project ID format'),
  query('status').optional().isIn(['todo', 'in_progress', 'done']),
  query('assignee').optional().isUUID(),
  query('overdue').optional().isBoolean(),
  validateRequest,
  requireProjectMember
], getTasks);

router.post('/', [
  param('id').isUUID().withMessage('Invalid project ID format'),
  body('title')
    .trim()
    .notEmpty().withMessage('Title is required')
    .isLength({ min: 3, max: 150 }).withMessage('Title must be between 3 and 150 characters'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 2000 }).withMessage('Description cannot exceed 2000 characters'),
  body('priority')
    .optional()
    .isIn(['low', 'medium', 'high']).withMessage('Invalid priority'),
  body('assigned_to')
    .optional({ checkFalsy: true })
    .isUUID().withMessage('Invalid assigned_to UUID format'),
  body('due_date')
    .optional({ checkFalsy: true })
    .isISO8601().withMessage('Invalid due_date format')
    .custom((value) => {
      if (new Date(value) < new Date(new Date().setHours(0,0,0,0))) {
        throw new Error('due_date must not be in the past');
      }
      return true;
    }),
  validateRequest,
  requireProjectMember,
  requireAdmin
], createTask);

router.get('/:taskId', [
  param('id').isUUID().withMessage('Invalid project ID format'),
  param('taskId').isUUID().withMessage('Invalid task ID format'),
  validateRequest,
  requireProjectMember
], getTaskById);

router.put('/:taskId', [
  param('id').isUUID().withMessage('Invalid project ID format'),
  param('taskId').isUUID().withMessage('Invalid task ID format'),
  body('title')
    .optional()
    .trim()
    .isLength({ min: 3, max: 150 }).withMessage('Title must be between 3 and 150 characters'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 2000 }).withMessage('Description cannot exceed 2000 characters'),
  body('priority')
    .optional()
    .isIn(['low', 'medium', 'high']).withMessage('Invalid priority'),
  body('assigned_to')
    .optional({ checkFalsy: true })
    .isUUID().withMessage('Invalid assigned_to UUID format'),
  body('due_date')
    .optional({ checkFalsy: true })
    .isISO8601().withMessage('Invalid due_date format')
    .custom((value) => {
      if (new Date(value) < new Date(new Date().setHours(0,0,0,0))) {
        throw new Error('due_date must not be in the past');
      }
      return true;
    }),
  validateRequest,
  requireProjectMember,
  requireAdmin
], updateTask);

router.patch('/:taskId/status', [
  param('id').isUUID().withMessage('Invalid project ID format'),
  param('taskId').isUUID().withMessage('Invalid task ID format'),
  body('status')
    .notEmpty().withMessage('Status is required')
    .isIn(['todo', 'in_progress', 'done']).withMessage('Invalid status'),
  validateRequest,
  requireProjectMember
], updateTaskStatus);

router.delete('/:taskId', [
  param('id').isUUID().withMessage('Invalid project ID format'),
  param('taskId').isUUID().withMessage('Invalid task ID format'),
  validateRequest,
  requireProjectMember,
  requireAdmin
], deleteTask);

module.exports = router;
