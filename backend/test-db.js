const mysql = require('mysql2/promise');
require('dotenv').config();

async function testConnection() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'hrms_db'
    });

    console.log('✅ Database connected successfully!');
    
    // Test query
    const [rows] = await connection.execute('SHOW TABLES');
    console.log('\n📋 Tables in database:');
    rows.forEach(row => {
      console.log('  -', Object.values(row)[0]);
    });
    
    await connection.end();
    console.log('\n✅ Test completed successfully!\n');
    
  } catch (error) {
    console.error('❌ Database connection failed:');
    console.error('Error:', error.message);
    console.error('\nTroubleshooting:');
    console.error('1. Make sure MySQL is running in XAMPP Control Panel');
    console.error('2. Check your .env file settings');
    console.error('3. Verify database "hrms_db" exists in phpMyAdmin');
  }
}

testConnection();
