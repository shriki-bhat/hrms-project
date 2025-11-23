// backend/src/controllers/teamController.js
const db = require('../db');
const { logOperation } = require('../utils/logger');

// Get all teams with employee counts
exports.getAllTeams = async (req, res) => {
  try {
    const result = await db.query(
      `SELECT t.*, 
        COUNT(DISTINCT te.employee_id) as employee_count,
        STRING_AGG(DISTINCT e.first_name || ' ' || e.last_name, ', ') as employee_names
       FROM teams t
       LEFT JOIN team_employees te ON t.id = te.team_id
       LEFT JOIN employees e ON te.employee_id = e.id
       WHERE t.org_id = $1
       GROUP BY t.id
       ORDER BY t.created_at DESC`,
      [req.user.orgId]
    );
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch teams' });
  }
};

// Get single team with its employees
exports.getTeamById = async (req, res) => {
  try {
    const team = await db.query(
      'SELECT * FROM teams WHERE id = $1 AND org_id = $2',
      [req.params.id, req.user.orgId]
    );
    
    if (team.rows.length === 0) {
      return res.status(404).json({ error: 'Team not found' });
    }
    
    const employees = await db.query(
      `SELECT e.* FROM employees e
       INNER JOIN team_employees te ON e.id = te.employee_id
       WHERE te.team_id = $1`,
      [req.params.id]
    );
    
    res.json({ ...team.rows[0], employees: employees.rows });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch team' });
  }
};

// Create team
exports.createTeam = async (req, res) => {
  const { name, description } = req.body;
  
  if (!name) {
    return res.status(400).json({ error: 'Team name is required' });
  }
  
  try {
    const result = await db.query(
      'INSERT INTO teams (org_id, name, description) VALUES (?, ?, ?)',
      [req.user.orgId, name, description || null]
    );
    
    // Get the created team
    const [team] = await db.query(
      'SELECT * FROM teams WHERE id = ?',
      [result.insertId]
    );
    
    console.log('✅ Team created successfully:', team[0]);
    logOperation(req.user.id, `created team '${team_name}' with ID ${team_id}.`);
    res.status(201).json(team[0]);
  } catch (error) {
    console.error('❌ Error creating team:', error);
    res.status(500).json({ error: 'Failed to create team', details: error.message });
  }
};

// Update team
exports.updateTeam = async (req, res) => {
  const { name, description } = req.body;
  
  if (!name) {
    return res.status(400).json({ error: 'Team name is required' });
  }
  
  try {
    const result = await db.query(
      'UPDATE teams SET name = $1, description = $2 WHERE id = $3 AND org_id = $4 RETURNING *',
      [name, description || null, req.params.id, req.user.orgId]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Team not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update team' });
  }
};

// Delete team
exports.deleteTeam = async (req, res) => {
  try {
    // First delete all team_employee relationships
    await db.query('DELETE FROM team_employees WHERE team_id = $1', [req.params.id]);
    
    // Then delete the team
    const result = await db.query(
      'DELETE FROM teams WHERE id = $1 AND org_id = $2 RETURNING *',
      [req.params.id, req.user.orgId]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Team not found' });
    }
    
logOperation(req.user.id, `deleted team ${team_id}.`);
    res.json({ message: 'Team deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete team' });
  }
};

// Assign employee to team
exports.assignEmployee = async (req, res) => {
  const { teamId } = req.params;
  const { employee_id } = req.body;
  
  // Validate inputs
  if (!employee_id) {
    return res.status(400).json({ error: 'employee_id is required' });
  }
  
  try {
    // Check if team exists and belongs to organization
    const teamCheck = await db.query(
      'SELECT * FROM teams WHERE id = $1 AND org_id = $2',
      [teamId, req.user.orgId]
    );
    
    if (teamCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Team not found' });
    }
    
    // Check if employee exists and belongs to organization
    const employeeCheck = await db.query(
      'SELECT * FROM employees WHERE id = $1 AND org_id = $2',
      [employee_id, req.user.orgId]
    );
    
    if (employeeCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Employee not found' });
    }
    
    // Check if already assigned
    const existing = await db.query(
      'SELECT * FROM team_employees WHERE team_id = $1 AND employee_id = $2',
      [teamId, employee_id]
    );
    
    if (existing.rows.length > 0) {
      return res.status(400).json({ error: 'Employee already assigned to this team' });
    }
    
    // Assign employee to team
    await db.query(
      'INSERT INTO team_employees (team_id, employee_id) VALUES ($1, $2)',
      [teamId, employee_id]
    );
    
    logOperation(req.user.id, `assigned employee ${employee_id} to team ${team_id}.`);
    res.json({ message: 'Employee assigned successfully' });
    
  } catch (error) {
    res.status(500).json({ error: 'Failed to assign employee' });
  }
};

// Unassign employee from team
exports.unassignEmployee = async (req, res) => {
  const { teamId } = req.params;
  const { employee_id } = req.body;
  
  if (!employee_id) {
    return res.status(400).json({ error: 'employee_id is required' });
  }
  
  try {
    const result = await db.query(
      'DELETE FROM team_employees WHERE team_id = $1 AND employee_id = $2 RETURNING *',
      [teamId, employee_id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Employee not assigned to this team' });
    }
    
    res.json({ message: 'Employee unassigned successfully' });
    
  } catch (error) {
    res.status(500).json({ error: 'Failed to unassign employee' });
  }
};
