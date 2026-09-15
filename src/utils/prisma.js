const { PrismaClient } = require("@prisma/client");

// Reuse a single PrismaClient instance across the app
// (avoids exhausting DB connections in dev with hot-reload)
const prisma = new PrismaClient();

module.exports = prisma;
