import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

// Create connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME || 'verlang',
  port: parseInt(process.env.DB_PORT || '3306'),
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0
});

// Test the connection
pool.getConnection()
  .then(connection => {
    console.log('✓ Database connected successfully');
    connection.release();
  })
  .catch(err => {
    console.error('✗ Database connection failed:', err.message);
  });

// Helper function to execute queries
export async function query<T = any>(sql: string, params: any[] = []): Promise<T[]> {
  try {
    const [rows] = await pool.execute(sql, params);
    return rows as T[];
  } catch (error) {
    console.error('Database query error:', (error as Error).message);
    throw error;
  }
}

// Helper function to get a single row
export async function queryOne<T = any>(sql: string, params: any[] = []): Promise<T | null> {
  const rows = await query<T>(sql, params);
  return rows[0] || null;
}

// Helper function to insert and get the inserted ID
export async function insert(sql: string, params: any[] = []): Promise<number> {
  try {
    const [result] = await pool.execute(sql, params);
    return (result as any).insertId;
  } catch (error) {
    console.error('Database insert error:', (error as Error).message);
    throw error;
  }
}

// Helper function to execute (update/delete)
export async function execute(sql: string, params: any[] = []): Promise<any> {
  try {
    const [result] = await pool.execute(sql, params);
    return result;
  } catch (error) {
    console.error('Database execute error:', (error as Error).message);
    throw error;
  }
}

export { pool };
export default { pool, query, queryOne, insert, execute };
