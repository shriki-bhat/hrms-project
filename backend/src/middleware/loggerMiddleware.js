const logger = require('../utils/logger');

module.exports = (req, res, next) => {
  const start = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - start;
    const message = `${req.method} ${req.originalUrl} ${res.statusCode} - ${duration}ms`;
    if (res.statusCode >= 400) {
      // Prefer this, so you have consistent logs
      logger.logOperation(
        req.user?.id || 'system',
        `[HTTP ${res.statusCode}] ${message}`
      );
    } else {
      // Optionally keep logging success as well, up to you!
      // logger.logOperation(req.user?.id || 'system', message);
    }
  });

  next();
};

