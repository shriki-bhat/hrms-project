const db = require('../config/db');
const Log = require('../models/Log');
const { logOperation } = require('../utils/logger');

// Get all employees for organisation
exports.getAll = async (req, res) => {
  try {
    const orgId = req.user.orgId;

    const [employees] = await db.execute(
      `SELECT e.*, 
              GROUP_CONCAT(DISTINCT t.name ORDER BY t.name SEPARATOR ', ') as team_names,
              GROUP_CONCAT(DISTINCT t.id ORDER BY t.id) as team_ids
       FROM employees e
       LEFT JOIN employee_teams et ON e.id = et.employee_id
       LEFT JOIN teams t ON et.team_id = t.id
       WHERE e.organisation_id = ?
       GROUP BY e.id
       ORDER BY e.created_at DESC`,
      [orgId]
    );

    res.json(employees);
  } catch (error) {
    console.error('Get employees error:', error);
    res.status(500).json({ error: 'Failed to fetch employees' });
  }
};

// Get single employee with team details
exports.getOne = async (req, res) => {
  try {
    const { id } = req.params;
    const orgId = req.user.orgId;

    const [employees] = await db.execute(
      'SELECT * FROM employees WHERE id = ? AND organisation_id = ?',
      [id, orgId]
    );

    if (employees.length === 0) {
      return res.status(404).json({ error: 'Employee not found' });
    }

    // Get employee teams
    const [teams] = await db.execute(
      `SELECT t.*, et.assigned_at 
       FROM teams t
       JOIN employee_teams et ON t.id = et.team_id
       WHERE et.employee_id = ?`,
      [id]
    );

    res.json({ ...employees[0], teams });
  } catch (error) {
    console.error('Get employee error:', error);
    res.status(500).json({ error: 'Failed to fetch employee' });
  }
};

// Create employee
exports.create = async (req, res) => {
  try {
    const { first_name, last_name, email, phone, position } = req.body;
    const orgId = req.user.orgId;
    const userId = req.user.userId;

    if (!first_name || !last_name) {
      return res.status(400).json({ error: 'First name and last name required' });
    }

    const [result] = await db.execute(
      `INSERT INTO employees (organisation_id, first_name, last_name, email, phone, position)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [orgId, first_name, last_name, email || null, phone || null, position || null]
    );

    const employeeId = result.insertId;

    // Log action
    await Log.create(orgId, userId, 'employee_created', 
      `Employee: ${first_name} ${last_name} (ID: ${employeeId})`);

    res.status(201).json({
      message: 'Employee created successfully',
      employee: { id: employeeId, first_name, last_name, email, phone, position }
    });
    logOperation(req.user.id, `added a new employee with ID ${result.insertId}.`);
  } catch (error) {
    console.error('Create employee error:', error);
    res.status(500).json({ error: 'Failed to create employee: ' + error.message });
  }
};

// Update employee
exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const { first_name, last_name, email, phone, position } = req.body;
    const orgId = req.user.orgId;
    const userId = req.user.userId;

    // Check if employee belongs to org
    const [existing] = await db.execute(
      'SELECT id, first_name, last_name FROM employees WHERE id = ? AND organisation_id = ?',
      [id, orgId]
    );

    if (existing.length === 0) {
      return res.status(404).json({ error: 'Employee not found' });
    }

    await db.execute(
      `UPDATE employees 
       SET first_name = ?, last_name = ?, email = ?, phone = ?, position = ?
       WHERE id = ?`,
      [first_name, last_name, email || null, phone || null, position || null, id]
    );

    // Log action
    await Log.create(orgId, userId, 'employee_updated', 
      `Employee ID: ${id} - ${first_name} ${last_name}`);

    res.json({ message: 'Employee updated successfully' });
    logOperation(req.user.id, `updated employee ${employee_id}.`);
  } catch (error) {
    console.error('Update employee error:', error);
    res.status(500).json({ error: 'Failed to update employee' });
  }
};

// Delete employee
exports.delete = async (req, res) => {
  try {
    const { id } = req.params;
    const orgId = req.user.orgId;
    const userId = req.user.userId;

    const [existing] = await db.execute(
      'SELECT first_name, last_name FROM employees WHERE id = ? AND organisation_id = ?',
      [id, orgId]
    );

    if (existing.length === 0) {
      return res.status(404).json({ error: 'Employee not found' });
    }

    await db.execute('DELETE FROM employees WHERE id = ?', [id]);

    // Log action
    await Log.create(orgId, userId, 'employee_deleted', 
      `Employee ID: ${id} - ${existing[0].first_name} ${existing[0].last_name}`);

    res.json({ message: 'Employee deleted successfully' });
    logOperation(req.user.id, `deleted employee ${req.params.id}.`)
  } catch (error) {
    console.error('Delete employee error:', error);
    res.status(500).json({ error: 'Failed to delete employee' });
  }
};
