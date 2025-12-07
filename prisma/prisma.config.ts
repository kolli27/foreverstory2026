/**
 * Prisma 7 Configuration File
 * Provides datasource configuration for Prisma Migrate
 */

export default {
  datasources: {
    db: {
      url: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/foreverstory',
    },
  },
};
