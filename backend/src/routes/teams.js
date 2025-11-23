// backend/src/routes/teams.js
const express = require('express');
const router = express.Router();
const db = require('../config/db');
const authMiddleware = require('../middleware/authMiddleware');

// Apply auth middleware to all routes
router.use(authMiddleware);

// Get all teams
router.get('/', async (req, res) => {
  try {
    const [teams] = await db.query(
      `SELECT t.*, 
        COUNT(DISTINCT te.employee_id) as employee_count,
        GROUP_CONCAT(DISTINCT CONCAT(e.first_name, ' ', e.last_name) SEPARATOR ', ') as employee_names
       FROM teams t
       LEFT JOIN team_employees te ON t.id = te.team_id
       LEFT JOIN employees e ON te.employee_id = e.id
       WHERE t.organisation_id = ?
       GROUP BY t.id
       ORDER BY t.created_at DESC`,
      [req.user.orgId]
    );
    res.json(teams);
  } catch (error) {
    console.error('❌ Error fetching teams:', error.message);
    res.status(500).json({ error: 'Failed to fetch teams' });
  }
});

// Get single team
router.get('/:id', async (req, res) => {
  try {
    const [team] = await db.query(
      'SELECT * FROM teams WHERE id = ? AND organisation_id = ?',
      [req.params.id, req.user.orgId]
    );
    
    if (team.length === 0) {
      return res.status(404).json({ error: 'Team not found' });
    }
    
    const [employees] = await db.query(
      `SELECT e.* FROM employees e
       INNER JOIN team_employees te ON e.id = te.employee_id
       WHERE te.team_id = ?`,
      [req.params.id]
    );
    
    res.json({ ...team[0], employees });
  } catch (error) {
    console.error('❌ Error fetching team:', error.message);
    res.status(500).json({ error: 'Failed to fetch team' });
  }
});

// Create team
router.post('/', async (req, res) => {
  const { name, description } = req.body;
  
  console.log('=== CREATE TEAM ===');
  console.log('Request body:', req.body);
  console.log('Org ID:', req.user.orgId);
  
  if (!name) {
    return res.status(400).json({ error: 'Team name is required' });
  }
  
  try {
    const [result] = await db.query(
      'INSERT INTO teams (organisation_id, name, description) VALUES (?, ?, ?)',
      [req.user.orgId, name, description || null]
    );
    
    const [newTeam] = await db.query(
      'SELECT * FROM teams WHERE id = ?',
      [result.insertId]
    );
    
    console.log('✅ Team created:', newTeam[0]);
    res.status(201).json(newTeam[0]);
    
  } catch (error) {
    console.error('❌ Error creating team:', error);
    res.status(500).json({ error: 'Failed to create team', details: error.message });
  }
});

// Update team
router.put('/:id', async (req, res) => {
  const { name, description } = req.body;
  
  if (!name) {
    return res.status(400).json({ error: 'Team name is required' });
  }
  
  try {
    await db.query(
      'UPDATE teams SET name = ?, description = ? WHERE id = ? AND organisation_id = ?',
      [name, description || null, req.params.id, req.user.orgId]
    );
    
    const [updatedTeam] = await db.query(
      'SELECT * FROM teams WHERE id = ?',
      [req.params.id]
    );
    
    if (updatedTeam.length === 0) {
      return res.status(404).json({ error: 'Team not found' });
    }
    
    console.log('✅ Team updated:', updatedTeam[0]);
    res.json(updatedTeam[0]);
    
  } catch (error) {
    console.error('❌ Error updating team:', error.message);
    res.status(500).json({ error: 'Failed to update team' });
  }
});

// Delete team
router.delete('/:id', async (req, res) => {
  try {
    await db.query('DELETE FROM team_employees WHERE team_id = ?', [req.params.id]);
    
    const [result] = await db.query(
      'DELETE FROM teams WHERE id = ? AND organisation_id = ?',
      [req.params.id, req.user.orgId]
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Team not found' });
    }
    
    console.log('✅ Team deleted');
    res.json({ message: 'Team deleted successfully' });
    
  } catch (error) {
    console.error('❌ Error deleting team:', error.message);
    res.status(500).json({ error: 'Failed to delete team' });
  }
});

// Assign employee to team
router.post('/:teamId/assign', async (req, res) => {
  const { teamId } = req.params;
  const { employee_id } = req.body;
  
  console.log('=== ASSIGN EMPLOYEE ===');
  console.log('Team ID:', teamId);
  console.log('Employee ID:', employee_id);
  
  if (!employee_id) {
    return res.status(400).json({ error: 'employee_id is required' });
  }
  
  try {
    // Check if already assigned
    const [existing] = await db.query(
      'SELECT * FROM team_employees WHERE team_id = ? AND employee_id = ?',
      [teamId, employee_id]
    );
    
    if (existing.length > 0) {
      return res.status(400).json({ error: 'Employee already assigned to this team' });
    }
    
    // Assign employee
    await db.query(
      'INSERT INTO team_employees (team_id, employee_id) VALUES (?, ?)',
      [teamId, employee_id]
    );
    
    console.log('✅ Employee assigned successfully');
    res.json({ message: 'Employee assigned successfully' });
    
  } catch (error) {
    console.error('❌ Error assigning employee:', error.message);
    res.status(500).json({ error: 'Failed to assign employee', details: error.message });
  }
});

// Unassign employee from team
router.post('/:teamId/unassign', async (req, res) => {
  const { teamId } = req.params;
  const { employee_id } = req.body;
  
  console.log('=== UNASSIGN EMPLOYEE ===');
  console.log('Team ID:', teamId);
  console.log('Employee ID:', employee_id);
  
  if (!employee_id) {
    return res.status(400).json({ error: 'employee_id is required' });
  }
  
  try {
    const [result] = await db.query(
      'DELETE FROM team_employees WHERE team_id = ? AND employee_id = ?',
      [teamId, employee_id]
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Employee not assigned to this team' });
    }
    
    console.log('✅ Employee unassigned successfully');
    res.json({ message: 'Employee unassigned successfully' });
    
  } catch (error) {
    console.error('❌ Error unassigning employee:', error.message);
    res.status(500).json({ error: 'Failed to unassign employee', details: error.message });
  }
});

module.exports = router;
