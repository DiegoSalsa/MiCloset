const { Pool } = require('pg');
const dotenv = require('dotenv');

dotenv.config();

console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('DATABASE_URL:', process.env.DATABASE_URL ? 'Configurada ✓' : 'NO CONFIGURADA ❌');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

pool.on('error', (err) => {
  console.error('Error en el pool de conexión:', err);
});

module.exports = pool;
