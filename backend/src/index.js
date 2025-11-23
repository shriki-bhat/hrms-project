// backend/src/index.js
const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const employeesRoutes = require('./routes/employees');
const teamsRoutes = require('./routes/teams');
const analyticsRoutes = require('./routes/analytics'); 
const { logOperation } = require('./utils/logger');
const loggerMiddleware = require('./middleware/loggerMiddleware'); 


const app = express();

app.use(cors());
app.use(express.json());
app.use(loggerMiddleware); 

app.use('/api/auth', authRoutes);
app.use('/api/employees', employeesRoutes);
app.use('/api/teams', teamsRoutes);
app.use('/api/analytics', analyticsRoutes); 

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  logOperation(`Server running on port ${PORT}`);
  console.log(`Server running on port ${PORT}`);
});
