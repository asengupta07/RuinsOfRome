import mongoose from "mongoose";

/**
 * This is a workaround for Next.js hot-reloading
 * We need to cache the MongoDB connection to avoid creating multiple connections during development
 */
declare global {
  // eslint-disable-next-line no-var
  var mongooseConnection:
    | {
        conn: typeof mongoose | null;
        promise: Promise<typeof mongoose> | null;
      }
    | undefined;
}

// MongoDB connection string
// In a real app, use .env.local to store this
const MONGODB_URI =
  process.env.MONGODB_URI || "shiii i was about to push this damn";

// Define the connection interface
interface Cached {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

// Initialize cached connection
const cached: Cached = global.mongooseConnection || {
  conn: null,
  promise: null,
};

// Save the connection in global for reuse
if (!global.mongooseConnection) {
  global.mongooseConnection = cached;
}

async function connectToDatabase() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose
      .connect(MONGODB_URI, opts)
      .then((mongoose) => {
        console.log("Connected to MongoDB");
        return mongoose;
      })
      .catch((error) => {
        console.error("Error connecting to MongoDB:", error);
        throw error;
      });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

export default connectToDatabase;
