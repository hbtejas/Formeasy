import mongoose from "mongoose";

let cached = global.mongoose || { conn: null, promise: null };

export async function connectDB() {
  if (cached.conn) return cached.conn;
  if (!cached.promise) {
    cached.promise = mongoose.connect(process.env.MONGODB_URI, {
      bufferCommands: false
    });
  }
  cached.conn = await cached.promise;
  global.mongoose = cached;
  return cached.conn;
}
