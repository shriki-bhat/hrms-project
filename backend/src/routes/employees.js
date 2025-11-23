const express = require('express');
const router = express.Router();
const employeeController = require('../controllers/employeeController');
const authMiddleware = require('../middleware/authMiddleware');
const db = require('../config/db');

// All routes require authentication
router.use(authMiddleware);

router.get('/', authMiddleware, async (req, res) => {
  try {
    const [employees] = await db.query(
      `SELECT e.*, 
      GROUP_CONCAT(t.name SEPARATOR ', ') AS team_names,
      GROUP_CONCAT(t.id SEPARATOR ',') AS team_ids
       FROM employees e
       LEFT JOIN team_employees te ON e.id = te.employee_id
       LEFT JOIN teams t ON te.team_id = t.id
       WHERE e.organisation_id = ?
       GROUP BY e.id
       ORDER BY e.created_at DESC`,
      [req.user.orgId]
    );
    res.json(employees);
  } catch (error) {
    console.error('Error fetching employees:', error);
    res.status(500).json({ error: 'Failed to fetch employees' });
  }
});

router.get('/:id', employeeController.getOne);
router.post('/', employeeController.create);
router.put('/:id', employeeController.update);
router.delete('/:id', employeeController.delete);

module.exports = router;
