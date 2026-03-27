
import { createError, defineEventHandler } from 'h3';
import { Client } from 'pg';

// Simple in-memory cache
const cache = new Map();
const CACHE_KEY = 'db-status';
const CACHE_TTL = 60 * 1000; // 60 seconds

export default defineEventHandler(async () => {
  const config = useRuntimeConfig();
  const connectionString = config.databaseUrl || config.databaseUrlUnpooled;

  if (!connectionString) {
    throw createError({
      statusCode: 400,
      statusMessage: 'DATABASE_URL is not configured'
    });
  }

  // Check cache
  const nowTime = Date.now();
  const cached = cache.get(CACHE_KEY);
  if (cached && nowTime - cached.time < CACHE_TTL) {
    return cached.data;
  }

  const client = new Client({
    connectionString,
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();
    const result = await client.query('SELECT NOW() as now');
    const data = {
      status: 'connected',
      now: result.rows[0]?.now ?? null
    };
    // Save to cache
    cache.set(CACHE_KEY, { data, time: nowTime });
    return data;
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