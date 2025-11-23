require('dotenv').config();
const mysql = require('mysql2/promise');

async function testDB() {
  console.log('\n🔍 Testing Database Connection...\n');
  console.log('Configuration:');
  console.log('  Host:', process.env.DB_HOST || 'localhost');
  console.log('  User:', process.env.DB_USER || 'root');
  console.log('  Password:', process.env.DB_PASSWORD ? '***' : '(empty)');
  console.log('  Database:', process.env.DB_NAME || 'hrms_db');
  console.log('');

  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'hrms_db'
    });

    console.log('✅ Database connected successfully!\n');

    const [rows] = await connection.execute('SHOW TABLES');
    console.log('📋 Tables found:');
    if (rows.length === 0) {
      console.log('  ⚠️  No tables found! Database might be empty.');
    } else {
      rows.forEach(row => {
        console.log('  ✓', Object.values(row)[0]);
      });
    }

    await connection.end();
    console.log('\n✅ Database test completed!\n');

  } catch (error) {
    console.error('\n❌ Database connection failed!\n');
    console.error('Error:', error.message);
    console.error('\nTroubleshooting:');
    console.error('1. Make sure XAMPP MySQL is running (green in control panel)');
    console.error('2. Verify database "hrms_db" exists in phpMyAdmin');
    console.error('3. Check .env file settings');
  }
}

testDB();
