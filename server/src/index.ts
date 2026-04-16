import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import helmet from "helmet";
import mongoose from "mongoose";
import morgan from "morgan";
import path from "node:path";
import fs from "node:fs";
import authRoutes from "./routes/authRoutes";
import formRoutes, { publicSubmitRouter } from "./routes/formRoutes";
import publicRoutes from "./routes/publicRoutes";
import { errorMiddleware } from "./middleware/errorMiddleware";

const rootEnvPath = path.resolve(process.cwd(), "server/.env");
const localEnvPath = path.resolve(process.cwd(), ".env");
dotenv.config({ path: fs.existsSync(rootEnvPath) ? rootEnvPath : localEnvPath });

const app = express();

app.use(helmet());
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true
  })
);
app.use(morgan("dev"));
app.use(cookieParser());
app.use(express.json({ limit: "2mb" }));

app.get("/health", (_req, res) => {
  res.json({ ok: true });
});

app.use("/api/auth", authRoutes);
app.use("/api/forms", publicSubmitRouter);
app.use("/api/forms", formRoutes);
app.use("/api/public", publicRoutes);

app.use(errorMiddleware);

const port = Number(process.env.PORT ?? 5000);

mongoose
  .connect(process.env.MONGODB_URI ?? "")
  .then(() => {
    app.listen(port, () => {
      // eslint-disable-next-line no-console
      console.log(`Server running on port ${port}`);
    });
  })
  .catch((error: unknown) => {
    // eslint-disable-next-line no-console
    console.error("MongoDB connection failed", error);
    process.exit(1);
  });
