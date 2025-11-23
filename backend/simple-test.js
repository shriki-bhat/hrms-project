const express = require('express');
const app = express();

app.get('/', (req, res) => {
  res.json({ 
    message: 'Hello! Simple test server is working!',
    timestamp: new Date().toISOString()
  });
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log('\n' + '='.repeat(50));
  console.log(`✅ Simple server running on http://localhost:${PORT}`);
  console.log(`📌 Open browser: http://localhost:${PORT}`);
  console.log('='.repeat(50) + '\n');
});
