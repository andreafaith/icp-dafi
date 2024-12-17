import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

const MONGODB_URI = process.env.MONGODB_URI!;

interface MongoConnection {
  isConnected: number;
}

const connection: MongoConnection = {
  isConnected: 0,
};

async function connect() {
  if (connection.isConnected) {
    return;
  }

  if (mongoose.connections.length > 0) {
    connection.isConnected = mongoose.connections[0].readyState;
    if (connection.isConnected === 1) {
      return;
    }
    await mongoose.disconnect();
  }

  const opts = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    bufferCommands: false,
    maxPoolSize: 10,
  };

  let uri = MONGODB_URI;

  // Use in-memory database for testing
  if (process.env.NODE_ENV === 'test') {
    const mongod = await MongoMemoryServer.create();
    uri = mongod.getUri();
  }

  const db = await mongoose.connect(uri, opts);
  connection.isConnected = db.connections[0].readyState;
}

async function disconnect() {
  if (process.env.NODE_ENV === 'production') {
    return;
  }

  if (connection.isConnected) {
    await mongoose.disconnect();
    connection.isConnected = 0;
  }
}

const db = { connect, disconnect };
export default db;
