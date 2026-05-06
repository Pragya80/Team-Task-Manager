const pool = require('../config/db');
const AppError = require('../utils/AppError');

const getMembers = async (req, res, next) => {
  const projectId = req.params.id;

  try {
    const result = await pool.query(`
      SELECT u.id, u.name, u.email, pm.role, pm.joined_at
      FROM project_members pm
      JOIN users u ON pm.user_id = u.id
      WHERE pm.project_id = $1
      ORDER BY pm.joined_at ASC
    `, [projectId]);

    res.status(200).json({ members: result.rows });
  } catch (err) {
    next(err);
  }
};

const addMember = async (req, res, next) => {
  const projectId = req.params.id;
  const { email, role } = req.body;
  const assignedRole = role === 'admin' ? 'admin' : 'member';

  try {
    // Lookup user by email
    const userResult = await pool.query('SELECT id, name, email FROM users WHERE email = $1', [email.toLowerCase()]);
    if (userResult.rows.length === 0) {
      return next(new AppError('User not found', 404));
    }
    const user = userResult.rows[0];

    // Check if already a member
    const memberCheck = await pool.query('SELECT id FROM project_members WHERE project_id = $1 AND user_id = $2', [projectId, user.id]);
    if (memberCheck.rows.length > 0) {
      return next(new AppError('User is already a member of this project', 409));
    }

    // Insert into project_members
    await pool.query(
      'INSERT INTO project_members (project_id, user_id, role) VALUES ($1, $2, $3)',
      [projectId, user.id, assignedRole]
    );

    res.status(201).json({
      member: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: assignedRole
      }
    });
  } catch (err) {
    next(err);
  }
};

const updateMemberRole = async (req, res, next) => {
  const projectId = req.params.id;
  const { userId } = req.params;
  const { role } = req.body;

  try {
    // If demoting to member, check if they are the last admin
    if (role === 'member') {
      const adminCount = await pool.query("SELECT COUNT(*) FROM project_members WHERE project_id = $1 AND role = 'admin'", [projectId]);
      const currentMember = await pool.query('SELECT role FROM project_members WHERE project_id = $1 AND user_id = $2', [projectId, userId]);

      if (currentMember.rows.length > 0 && currentMember.rows[0].role === 'admin' && parseInt(adminCount.rows[0].count) <= 1) {
        return next(new AppError('Cannot change role of the last admin', 400));
      }
    }

    const result = await pool.query(
      'UPDATE project_members SET role = $1 WHERE project_id = $2 AND user_id = $3 RETURNING user_id, role',
      [role, projectId, userId]
    );

    if (result.rows.length === 0) {
      return next(new AppError('Member not found in project', 404));
    }

    res.status(200).json({ member: { id: result.rows[0].user_id, role: result.rows[0].role } });
  } catch (err) {
    next(err);
  }
};

const removeMember = async (req, res, next) => {
  const projectId = req.params.id;
  const { userId } = req.params;

  try {
    // Check if removing the last admin
    const adminCount = await pool.query("SELECT COUNT(*) FROM project_members WHERE project_id = $1 AND role = 'admin'", [projectId]);
    const currentMember = await pool.query('SELECT role FROM project_members WHERE project_id = $1 AND user_id = $2', [projectId, userId]);

    if (currentMember.rows.length > 0 && currentMember.rows[0].role === 'admin' && parseInt(adminCount.rows[0].count) <= 1) {
      return next(new AppError('Cannot remove the last admin', 400));
    }

    const result = await pool.query(
      'DELETE FROM project_members WHERE project_id = $1 AND user_id = $2 RETURNING id',
      [projectId, userId]
    );

    if (result.rows.length === 0) {
      return next(new AppError('Member not found in project', 404));
    }

    res.status(200).json({ message: 'Member removed' });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getMembers,
  addMember,
  updateMemberRole,
  removeMember
};
