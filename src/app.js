import express from "express";
import morgan from "morgan";

import "./config/firebase.js";

import runRoutes from "./routes/runs.js";
// import userRoutes from "./routes/users.js";

import { db } from "./config/firebase.js";

const app = express();

app.use(morgan("dev"));
app.use(express.json());

// ── Routes ──────────────────────────────────────────────────────────────────
app.get("/", (req, res) => res.json({ status: "ok" }));

app.get("/health", async (req, res) => {
  try {
    await db.collection("runs").limit(1).get();
    res.json({ status: "ok", firestore: "connected" });
  } catch (err) {
    res.json({ status: "ok", firestore: "failed", error: err.message });
  }
});

// app.use("/api/users", userRoutes);
app.use("/api/runs", runRoutes);

// // ── Error Handler ────────────────────────────────────────────────────────────
// app.use(errorHandler);

export default app;
