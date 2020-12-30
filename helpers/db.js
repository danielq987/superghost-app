/* Set up database */

const { Pool } = require('pg');
const url = require('url')

const params = new URL(process.env.DATABASE_URL);

const config = {
  user: params.username,
  password: params.password,
  host: params.hostname,
  port: params.port,
  database: params.pathname.substring(1),
  ssl: { rejectUnauthorized: false }
}

console.log(process.env.DATABASE_URL);

const pool = new Pool(config);

module.exports = pool;