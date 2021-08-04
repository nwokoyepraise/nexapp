require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || process.env.CONN_STRING,
  ssl: {
    rejectUnauthorized: false
  }
});

module.exports = pool;