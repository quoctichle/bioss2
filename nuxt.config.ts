// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  runtimeConfig: {
    databaseUrl: process.env.DATABASE_URL || '',
    databaseUrlUnpooled: process.env.DATABASE_URL_UNPOOLED || '',
    databaseHost: process.env.PGHOST || '',
    databaseHostUnpooled: process.env.PGHOST_UNPOOLED || '',
    databaseUser: process.env.PGUSER || '',
    databasePassword: process.env.PGPASSWORD || '',
    databaseName: process.env.PGDATABASE || ''
  }
})
