import mysql from 'mysql2/promise';

/**
 * Checks whether MySQL configuration is provided in the environment.
 */
export function isMySqlConfigured(): boolean {
  return Boolean(
    process.env.MYSQL_DATABASE ||
    process.env.MYSQL_URL ||
    process.env.DATABASE_URL ||
    process.env.USE_MYSQL === 'true'
  );
}

let pool: mysql.Pool | null = null;

/**
 * Returns a singleton connection pool to MySQL.
 */
export function getMySqlPool(): mysql.Pool {
  if (!pool) {
    const connectionUrl = process.env.MYSQL_URL || process.env.DATABASE_URL;

    if (connectionUrl && connectionUrl.startsWith('mysql://')) {
      pool = mysql.createPool({
        uri: connectionUrl,
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0,
        charset: 'utf8mb4',
        dateStrings: true,
      });
    } else {
      pool = mysql.createPool({
        host: process.env.MYSQL_HOST || '127.0.0.1',
        port: parseInt(process.env.MYSQL_PORT || '3306', 10),
        user: process.env.MYSQL_USER || 'root',
        password: process.env.MYSQL_PASSWORD || '',
        database: process.env.MYSQL_DATABASE || 'demo_practics',
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0,
        charset: 'utf8mb4',
        dateStrings: true,
      });
    }
  }

  return pool;
}

/**
 * Helper to execute a query with error handling.
 */
export async function query<T = unknown>(sql: string, params: unknown[] = []): Promise<T> {
  const p = getMySqlPool();
  const [rows] = await p.query(sql, params);
  return rows as T;
}

/**
 * Helper to close pool (for graceful shutdown / migration scripts).
 */
export async function closeMySqlPool(): Promise<void> {
  if (pool) {
    await pool.end();
    pool = null;
  }
}
