const db = require('../config/db');

class Log {
  static async create(orgId, userId, action, details = '') {
    const query = `
      INSERT INTO logs (organisation_id, user_id, action, details)
      VALUES (?, ?, ?, ?)
    `;
    
    try {
      await db.execute(query, [orgId, userId, action, details]);
      console.log(`📝 Log created: ${action}`);
    } catch (error) {
      console.error('Error creating log:', error);
    }
  }

  static async getByOrganisation(orgId, limit = 100) {
    const query = `
      SELECT l.*, u.name as user_name
      FROM logs l
      LEFT JOIN users u ON l.user_id = u.id
      WHERE l.organisation_id = ?
      ORDER BY l.timestamp DESC
      LIMIT ?
    `;
    
    try {
      const [rows] = await db.execute(query, [orgId, limit]);
      return rows;
    } catch (error) {
      console.error('Error fetching logs:', error);
      return [];
    }
  }
}

module.exports = Log;
