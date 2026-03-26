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
    const { rows } = await client.query(
      `SELECT "eventId", "startsAt", "endsAt", "link"
       FROM public."Event"
       WHERE "startsAt" <= NOW()
         AND "endsAt" >= NOW()
         AND COALESCE(NULLIF(TRIM("link"), ''), '') != ''
       ORDER BY "startsAt" DESC
       LIMIT 1`
    );

    return { event: rows[0] ?? null };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw createError({
      statusCode: 502,
      statusMessage: `Neon event lookup failed: ${message}`
    });
  } finally {
    await client.end();
  }
});