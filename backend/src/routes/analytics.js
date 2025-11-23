const express = require('express');
const router = express.Router();
const db = require('../config/db');
const authMiddleware = require('../middleware/authMiddleware');

// All analytics routes require authentication
router.use(authMiddleware);

router.get('/', async (req, res) => {
  try {
    const orgId = req.user.orgId;

    // Total Employees
    const [totalEmployeesRows] = await db.query(
      'SELECT COUNT(*) as count FROM employees WHERE organisation_id = ?', [orgId]
    );

    // Total Teams
    const [totalTeamsRows] = await db.query(
      'SELECT COUNT(*) as count FROM teams WHERE organisation_id = ?', [orgId]
    );

    // Employees per Team
    const [employeesPerTeam] = await db.query(
      `SELECT t.name as team_name, COUNT(te.employee_id) as employee_count
       FROM teams t
       LEFT JOIN team_employees te ON t.id = te.team_id
       WHERE t.organisation_id = ?
       GROUP BY t.id, t.name
       ORDER BY employee_count DESC`, [orgId]
    );

    // Unassigned Employees
    const [unassignedEmployeesRows] = await db.query(
      `SELECT COUNT(*) as count FROM employees e
       WHERE e.organisation_id = ?
       AND e.id NOT IN (SELECT employee_id FROM team_employees)`, [orgId]
    );

    // Team Size Distribution
    const [teamDistribution] = await db.query(
  `SELECT size, COUNT(*) as team_count FROM (
      SELECT 
        CASE 
          WHEN COUNT(te.employee_id) = 0 THEN 'Empty'
          WHEN COUNT(te.employee_id) BETWEEN 1 AND 3 THEN 'Small (1-3)'
          WHEN COUNT(te.employee_id) BETWEEN 4 AND 7 THEN 'Medium (4-7)'
          ELSE 'Large (8+)'
        END as size
      FROM teams t
      LEFT JOIN team_employees te ON t.id = te.team_id
      WHERE t.organisation_id = ?
      GROUP BY t.id
  ) as size_groups
  GROUP BY size
  ORDER BY size`,
  [orgId]
);



    res.json({
      totalEmployees: totalEmployeesRows[0]["count"],
      totalTeams: totalTeamsRows[0]["count"],
      unassignedEmployees: unassignedEmployeesRows[0]["count"],
      employeesPerTeam,
      teamDistribution
    });

  } catch (error) {
    console.error('Error fetching analytics:', error);
    res.status(500).json({ error: 'Analytics fetch failed' });
  }
});

module.exports = router;
