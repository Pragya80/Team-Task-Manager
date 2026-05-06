const pool = require('../config/db');
const AppError = require('../utils/AppError');

const getTasks = async (req, res, next) => {
  const projectId = req.params.id;
  const { status, assignee, overdue } = req.query;

  try {
    let query = `
      SELECT t.id, t.title, t.status, t.priority, t.due_date, t.created_by, t.created_at,
             (t.due_date < NOW() AND t.status != 'done') AS is_overdue,
             json_build_object('id', u.id, 'name', u.name) as assigned_to
      FROM tasks t
      LEFT JOIN users u ON t.assigned_to = u.id
      WHERE t.project_id = $1
    `;
    const params = [projectId];
    let paramIndex = 2;

    if (status) {
      query += ` AND t.status = $${paramIndex}`;
      params.push(status);
      paramIndex++;
    }

    if (assignee) {
      query += ` AND t.assigned_to = $${paramIndex}`;
      params.push(assignee);
      paramIndex++;
    }

    if (overdue === 'true') {
      query += ` AND t.due_date < NOW() AND t.status != 'done'`;
    }

    query += ` ORDER BY t.created_at DESC`;

    const result = await pool.query(query, params);

    const tasks = result.rows.map(row => ({
      ...row,
      assigned_to: row.assigned_to.id ? row.assigned_to : null
    }));

    res.status(200).json({ tasks });
  } catch (err) {
    next(err);
  }
};

const createTask = async (req, res, next) => {
  const projectId = req.params.id;
  const { title, description, priority, assigned_to, due_date } = req.body;
  const userId = req.user.userId;

  try {
    if (assigned_to) {
      const memberCheck = await pool.query('SELECT 1 FROM project_members WHERE project_id = $1 AND user_id = $2', [projectId, assigned_to]);
      if (memberCheck.rows.length === 0) {
        return next(new AppError('Assigned user is not a project member', 400));
      }
    }

    const result = await pool.query(
      `INSERT INTO tasks (project_id, title, description, priority, assigned_to, due_date, created_by)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING id, title, status, priority, assigned_to, due_date, created_by, created_at`,
      [projectId, title, description || null, priority || 'medium', assigned_to || null, due_date || null, userId]
    );

    res.status(201).json({ task: result.rows[0] });
  } catch (err) {
    next(err);
  }
};

const getTaskById = async (req, res, next) => {
  const { id: projectId, taskId } = req.params;

  try {
    const result = await pool.query(`
      SELECT t.id, t.title, t.description, t.status, t.priority, t.due_date, t.created_at,
             json_build_object('id', a.id, 'name', a.name, 'email', a.email) as assigned_to,
             json_build_object('id', c.id, 'name', c.name) as created_by
      FROM tasks t
      LEFT JOIN users a ON t.assigned_to = a.id
      LEFT JOIN users c ON t.created_by = c.id
      WHERE t.id = $1 AND t.project_id = $2
    `, [taskId, projectId]);

    if (result.rows.length === 0) {
      return next(new AppError('Task not found', 404));
    }

    const task = result.rows[0];
    task.assigned_to = task.assigned_to.id ? task.assigned_to : null;
    task.created_by = task.created_by.id ? task.created_by : null;

    res.status(200).json({ task });
  } catch (err) {
    next(err);
  }
};

const updateTask = async (req, res, next) => {
  const { id: projectId, taskId } = req.params;
  const { title, description, priority, assigned_to, due_date } = req.body;

  try {
    if (assigned_to) {
      const memberCheck = await pool.query('SELECT 1 FROM project_members WHERE project_id = $1 AND user_id = $2', [projectId, assigned_to]);
      if (memberCheck.rows.length === 0) {
        return next(new AppError('Assigned user is not a project member', 400));
      }
    }

    const result = await pool.query(
      `UPDATE tasks 
       SET title = COALESCE($1, title), 
           description = COALESCE($2, description), 
           priority = COALESCE($3, priority), 
           assigned_to = COALESCE($4, assigned_to), 
           due_date = COALESCE($5, due_date),
           updated_at = NOW()
       WHERE id = $6 AND project_id = $7
       RETURNING *`,
      [title, description, priority, assigned_to, due_date, taskId, projectId]
    );

    if (result.rows.length === 0) {
      return next(new AppError('Task not found', 404));
    }

    res.status(200).json({ task: result.rows[0] });
  } catch (err) {
    next(err);
  }
};

const updateTaskStatus = async (req, res, next) => {
  const { id: projectId, taskId } = req.params;
  const { status } = req.body;
  const userId = req.user.userId;
  const userRole = req.userRole;

  try {
    // If member, verify task is assigned to them
    if (userRole === 'member') {
      const taskCheck = await pool.query('SELECT assigned_to FROM tasks WHERE id = $1 AND project_id = $2', [taskId, projectId]);
      if (taskCheck.rows.length === 0) {
        return next(new AppError('Task not found', 404));
      }
      if (taskCheck.rows[0].assigned_to !== userId) {
        return next(new AppError('Forbidden: You can only update status of tasks assigned to you', 403));
      }
    }

    const result = await pool.query(
      `UPDATE tasks SET status = $1, updated_at = NOW() WHERE id = $2 AND project_id = $3 RETURNING id, status`,
      [status, taskId, projectId]
    );

    if (result.rows.length === 0) {
      return next(new AppError('Task not found', 404));
    }

    res.status(200).json({ task: result.rows[0] });
  } catch (err) {
    next(err);
  }
};

const deleteTask = async (req, res, next) => {
  const { id: projectId, taskId } = req.params;

  try {
    const result = await pool.query('DELETE FROM tasks WHERE id = $1 AND project_id = $2 RETURNING id', [taskId, projectId]);

    if (result.rows.length === 0) {
      return next(new AppError('Task not found', 404));
    }

    res.status(200).json({ message: 'Task deleted' });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getTasks,
  createTask,
  getTaskById,
  updateTask,
  updateTaskStatus,
  deleteTask
};
