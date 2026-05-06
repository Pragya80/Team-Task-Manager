const pool = require('../config/db');
const AppError = require('../utils/AppError');

const requireProjectMember = async (req, res, next) => {
  const projectId = req.params.id || req.params.projectId;
  const userId = req.user.userId;

  try {
    const result = await pool.query(
      'SELECT role FROM project_members WHERE project_id = $1 AND user_id = $2',
      [projectId, userId]
    );

    if (result.rows.length === 0) {
      return next(new AppError('Forbidden: You are not a member of this project', 403));
    }

    req.userRole = result.rows[0].role;
    next();
  } catch (err) {
    next(err);
  }
};

const requireAdmin = (req, res, next) => {
  if (req.userRole !== 'admin') {
    return next(new AppError('Forbidden: Requires admin role', 403));
  }
  next();
};

module.exports = {
  requireProjectMember,
  requireAdmin
};
