const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../config/db');
const Log = require('../models/Log');
const { logOperation } = require('../utils/logger');

// Register new organisation
exports.register = async (req, res) => {
  try {
    const { orgName, adminName, email, password } = req.body;

    // Validate input
    if (!orgName || !adminName || !email || !password) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }

    // Check if email exists
    const [existing] = await db.execute(
      'SELECT id FROM users WHERE email = ?',
      [email]
    );

    if (existing.length > 0) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    // Create organisation
    const [orgResult] = await db.execute(
      'INSERT INTO organisations (name) VALUES (?)',
      [orgName]
    );
    const orgId = orgResult.insertId;

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Create admin user
    const [userResult] = await db.execute(
  "INSERT INTO users (organisation_id, email, password) VALUES (?, ?, ?)",
  [organisationId, email, passwordHash]
);
    const userId = userResult.insertId;

    // Create JWT token
    const token = jwt.sign(
      { userId, orgId, email },
      process.env.JWT_SECRET,
      { expiresIn: '8h' }
    );

    // Log the action
    await Log.create(orgId, userId, 'organisation_created', `Organisation: ${orgName}`);

    res.status(201).json({
      message: 'Organisation created successfully',
      token,
      user: { id: userId, name: adminName, email, orgId, orgName }
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Registration failed: ' + error.message });
  }
};


// Login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }

    // Find user with organisation info (include organisation name)
    const [users] = await db.execute(
      `SELECT password FROM users WHERE email = ?`,
      [email]
    );

    if (users.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const user = users[0];

    // Verify password
    const isValid = await bcrypt.compare(password, user.password);

    if (!isValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Create token
    const token = jwt.sign(
      { userId: user.id, orgId: user.organisation_id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '8h' }
    );

    // Log login
    await Log.create(user.organisation_id, user.id, 'user_login', `User: ${email}`);

    // Log operation and return response
    logOperation(user.id, 'logged in.');
    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        orgId: user.organisation_id,
        orgName: user.org_name
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed: ' + error.message });
  }
};

// Logout (just for logging purposes)
exports.logout = async (req, res) => {
  try {
    const { userId, orgId } = req.user;
    
    await Log.create(orgId, userId, 'user_logout', 'User logged out');
    // Record local operation log and return
    logOperation(userId, 'logged out.');
    res.json({ message: 'Logged out successfully' });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ error: 'Logout failed' });
  }
};
