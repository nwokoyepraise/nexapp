const { Pool } = require('pg');

const pool = new Pool({
  connectionString: 'postgres://tpkhertoauwmof:ffd09fa57cad8eb975322702b9731bd3f6822551c5dea7531e55e2d181e49fb3@ec2-35-174-56-18.compute-1.amazonaws.com:5432/der5robd57ms1k',
  ssl: {
    rejectUnauthorized: false
  }
});

module.exports = pool;