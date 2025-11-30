const { defineConfig } = require('@prisma/config');

module.exports = defineConfig({
  schema: './prisma/schema.prisma',

  datasource: {
    db: {
      provider: 'postgresql',
      url: process.env.DATABASE_URL,
    },
  },

  migrate: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
});
