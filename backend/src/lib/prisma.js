/**
 * Prisma Client Singleton — Prajnaa
 * Global caching pattern to avoid connection exhaustion during hot reload.
 */

const { PrismaClient } = require('@prisma/client');

/** @type {PrismaClient} */
let prisma;

if (process.env.NODE_ENV === 'production') {
  prisma = new PrismaClient({});
} else {
  // In development, reuse the client across hot reloads
  if (!globalThis.__prisma) {
    globalThis.__prisma = new PrismaClient({});
  }
  prisma = globalThis.__prisma;
}

module.exports = { prisma };
