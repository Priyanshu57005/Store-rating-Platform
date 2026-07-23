import app from './app';
import dotenv from 'dotenv';
import { prisma } from './config/db';

dotenv.config();

const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    // Verify database connectivity
    await prisma.$connect();
    console.log('✅ Connected to MySQL database successfully via Prisma.');

    app.listen(PORT, () => {
      console.log(`🚀 Store Rating Platform Backend Server listening on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('❌ Failed to connect to MySQL database:', error);
    process.exit(1);
  }
}

startServer();
