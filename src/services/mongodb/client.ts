import { MongoClient, Db } from 'mongodb';

const uri = process.env.MONGODB_URI || '';
const dbName = process.env.MONGODB_DB_NAME || 'devphoenix';

export const hasMongoConfig = !!uri;

if (!hasMongoConfig) {
  console.warn(
    '⚠️ MONGODB_URI MISSING: Running in disconnected mode. Add MONGODB_URI to your .env.local to connect to MongoDB.'
  );
}

// ---------------------------------------------------------------------------
// Singleton MongoClient – reused across hot reloads in development
// ---------------------------------------------------------------------------

// Extend globalThis so the cached client survives Next.js HMR reloads
const globalWithMongo = globalThis as typeof globalThis & {
  _mongoClient?: MongoClient;
  _mongoClientPromise?: Promise<MongoClient>;
};

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

if (hasMongoConfig) {
  const mongoOptions = {
    serverSelectionTimeoutMS: 3000, // fail fast — 3 seconds max
    connectTimeoutMS: 3000,
    socketTimeoutMS: 5000,
  };

  if (process.env.NODE_ENV === 'development') {
    // In dev, reuse the client across hot reloads
    if (!globalWithMongo._mongoClientPromise) {
      client = new MongoClient(uri, mongoOptions);
      globalWithMongo._mongoClientPromise = client.connect();
      globalWithMongo._mongoClient = client;
      console.log('🍃 MongoDB client created (dev singleton)');
    }
    clientPromise = globalWithMongo._mongoClientPromise;
  } else {
    // In production, create a fresh client
    client = new MongoClient(uri, mongoOptions);
    clientPromise = client.connect();
    console.log('🍃 MongoDB client created (production)');
  }
}

/**
 * Returns the connected Db instance.
 * All service methods should call this to get the database handle.
 */
export async function getDb(): Promise<Db> {
  if (!hasMongoConfig) {
    throw new Error('MongoDB is not configured. Set MONGODB_URI in .env.local');
  }
  const connectedClient = await clientPromise!;
  return connectedClient.db(dbName);
}
