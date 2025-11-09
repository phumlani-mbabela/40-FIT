
import pg from 'pg';
const { Pool } = pg;

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 10,
  ssl: process.env.PGSSL === 'true' ? { rejectUnauthorized: false } : false,
});

export async function tx(fn){
  const client = await pool.connect();
  try{
    await client.query('begin');
    const res = await fn(client);
    await client.query('commit');
    return res;
  }catch(e){
    await client.query('rollback'); throw e;
  }finally{
    client.release();
  }
}
