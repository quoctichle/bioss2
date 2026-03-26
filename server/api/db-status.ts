import { createError, defineEventHandler } from 'h3';
import { Client } from 'pg';

export default defineEventHandler(async () => {
  const config = useRuntimeConfig();
  const connectionString = config.databaseUrl || config.databaseUrlUnpooled;

  if (!connectionString) {
    throw createError({
      statusCode: 400,
      statusMessage: 'DATABASE_URL is not configured'
    });
  }

  const client = new Client({
    connectionString,
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();
    const result = await client.query('SELECT NOW() as now');
    return {
      status: 'connected',
      now: result.rows[0]?.now ?? null
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw createError({
      statusCode: 502,
      statusMessage: `Neon check failed: ${message}`
    });
  } finally {
    await client.end();
  }
});