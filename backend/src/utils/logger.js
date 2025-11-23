const fs = require('fs');
const path = require('path');

const logsDir = path.join(__dirname, '../../logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

const logFile = path.join(logsDir, 'actions.log');

const logOperation = (userId, message) => {
  const timestamp = new Date().toISOString().replace('T', ' ').slice(0, 19);
  const logEntry = `[${timestamp}] User '${userId}' ${message}\n`;

  fs.appendFile(logFile, logEntry, (err) => {
    if (err) {
      console.error('Log writing failed:', err);
    }
  });

  // Print to console (optional)
  console.log(logEntry.trim());
};

module.exports = { logOperation };
