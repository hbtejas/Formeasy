import mongoose from "mongoose";

let cached = global.mongoose || { conn: null, promise: null };

export async function connectDB() {
  if (cached.conn) return cached.conn;
  const mongoUri = process.env.MONGODB_URI;
  if (!mongoUri) {
    const error = new Error("MONGODB_URI is not configured");
    error.status = 500;
    throw error;
  }
  if (!cached.promise) {
    cached.promise = mongoose.connect(mongoUri, {
      bufferCommands: false
    });
  }
  cached.conn = await cached.promise;
  global.mongoose = cached;
  return cached.conn;
}
