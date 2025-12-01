import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";

import authRoutes from "./src/routes/authRoutes.js";
import resumeRoutes from "./src/routes/resumeRoutes.js";
import jobRoutes from "./src/routes/jobRoutes.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/uploads", express.static(path.resolve("uploads")));

app.use("/api/auth", authRoutes);
app.use("/api/resume", resumeRoutes);
app.use("/api/jobs", jobRoutes);

app.get("/", (req, res) => {
  res.send("SwipeHire Backend Running!");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`SwipeHire backend running on port ${PORT}`)
);
