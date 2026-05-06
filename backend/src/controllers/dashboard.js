const pool = require('../config/db');

const getDashboardStats = async (req, res, next) => {
  const projectId = req.params.id;

  try {
    const summaryResult = await pool.query(`
      SELECT
        COUNT(*) AS total,
        COUNT(*) FILTER (WHERE status = 'todo') AS todo,
        COUNT(*) FILTER (WHERE status = 'in_progress') AS in_progress,
        COUNT(*) FILTER (WHERE status = 'done') AS done,
        COUNT(*) FILTER (WHERE due_date < NOW() AND status != 'done') AS overdue
      FROM tasks WHERE project_id = $1
    `, [projectId]);

    const overdueResult = await pool.query(`
      SELECT t.id, t.title, t.due_date, t.priority,
             u.name AS assignee_name, u.email AS assignee_email
      FROM tasks t
      LEFT JOIN users u ON t.assigned_to = u.id
      WHERE t.project_id = $1
        AND t.due_date < NOW()
        AND t.status != 'done'
      ORDER BY t.due_date ASC
    `, [projectId]);

    // Format the COUNT values from string to integers
    const rawSummary = summaryResult.rows[0];
    const summary = {
      total: parseInt(rawSummary.total || 0, 10),
      todo: parseInt(rawSummary.todo || 0, 10),
      in_progress: parseInt(rawSummary.in_progress || 0, 10),
      done: parseInt(rawSummary.done || 0, 10),
      overdue: parseInt(rawSummary.overdue || 0, 10),
    };

    res.status(200).json({
      summary,
      overdueTasks: overdueResult.rows
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getDashboardStats
};
