import mongoose from 'mongoose';

let memoryServer = null;

export async function connectDB() {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/labguard';

  try {
    // Attempt standard connection first (local mongod or Atlas URI)
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 2500, // fast failover if local daemon isn't running
    });
    console.log(`✅ MongoDB Connected to: ${conn.connection.host}/${conn.connection.name}`);
    return conn;
  } catch (err) {
    console.warn(`⚠️ Standard MongoDB connection failed: ${err.message}`);
    console.log(`⚡ Initializing Zero-Config In-Memory MongoDB engine for seamless demo...`);

    try {
      const { MongoMemoryServer } = await import('mongodb-memory-server');
      memoryServer = await MongoMemoryServer.create();
      const memoryUri = memoryServer.getUri();

      const conn = await mongoose.connect(memoryUri);
      console.log(`🚀 Embedded In-Memory MongoDB active at: ${memoryUri}`);
      console.log(`✨ The application is fully functional with live reads/writes!`);
      return conn;
    } catch (memErr) {
      console.error(`❌ Critical: Could not start in-memory database:`, memErr);
      throw memErr;
    }
  }
}

export async function disconnectDB() {
  await mongoose.disconnect();
  if (memoryServer) {
    await memoryServer.stop();
  }
}
