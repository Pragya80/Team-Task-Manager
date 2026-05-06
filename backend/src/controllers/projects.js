const pool = require('../config/db');
const AppError = require('../utils/AppError');

const getAllProjects = async (req, res, next) => {
  const userId = req.user.userId;

  try {
    const result = await pool.query(`
      SELECT 
        p.id, 
        p.name, 
        p.description, 
        p.created_at, 
        pm.role,
        (SELECT COUNT(*) FROM tasks t WHERE t.project_id = p.id) as task_count,
        (SELECT COUNT(*) FROM project_members pm2 WHERE pm2.project_id = p.id) as member_count
      FROM projects p
      JOIN project_members pm ON p.id = pm.project_id
      WHERE pm.user_id = $1
      ORDER BY p.created_at DESC
    `, [userId]);

    // Format the counts from string (pg returns COUNT as string) to int
    const projects = result.rows.map(row => ({
      ...row,
      task_count: parseInt(row.task_count, 10),
      member_count: parseInt(row.member_count, 10)
    }));

    res.status(200).json({ projects });
  } catch (err) {
    next(err);
  }
};

const createProject = async (req, res, next) => {
  const { name, description } = req.body;
  const userId = req.user.userId;

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const projectResult = await client.query(
      'INSERT INTO projects (name, description, created_by) VALUES ($1, $2, $3) RETURNING id, name, description, created_at',
      [name, description, userId]
    );
    const project = projectResult.rows[0];

    await client.query(
      "INSERT INTO project_members (project_id, user_id, role) VALUES ($1, $2, 'admin')",
      [project.id, userId]
    );

    await client.query('COMMIT');

    res.status(201).json({ project });
  } catch (err) {
    await client.query('ROLLBACK');
    next(err);
  } finally {
    client.release();
  }
};

const getProjectById = async (req, res, next) => {
  const { id } = req.params;

  try {
    const projectResult = await pool.query(
      'SELECT id, name, description, created_at FROM projects WHERE id = $1',
      [id]
    );

    if (projectResult.rows.length === 0) {
      return next(new AppError('Project not found', 404));
    }

    const project = projectResult.rows[0];

    const membersResult = await pool.query(`
      SELECT u.id, u.name, u.email, pm.role, pm.joined_at 
      FROM project_members pm
      JOIN users u ON pm.user_id = u.id
      WHERE pm.project_id = $1
    `, [id]);

    project.members = membersResult.rows;

    res.status(200).json({ project });
  } catch (err) {
    next(err);
  }
};

const updateProject = async (req, res, next) => {
  const { id } = req.params;
  const { name, description } = req.body;

  try {
    const result = await pool.query(
      'UPDATE projects SET name = COALESCE($1, name), description = COALESCE($2, description), updated_at = NOW() WHERE id = $3 RETURNING id, name, description',
      [name, description, id]
    );

    if (result.rows.length === 0) {
      return next(new AppError('Project not found', 404));
    }

    res.status(200).json({ project: result.rows[0] });
  } catch (err) {
    next(err);
  }
};

const deleteProject = async (req, res, next) => {
  const { id } = req.params;

  try {
    const result = await pool.query('DELETE FROM projects WHERE id = $1 RETURNING id', [id]);

    if (result.rows.length === 0) {
      return next(new AppError('Project not found', 404));
    }

    res.status(200).json({ message: 'Project deleted' });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getAllProjects,
  createProject,
  getProjectById,
  updateProject,
  deleteProject
};
