import express from "express";
import { uploadResume } from "../middleware/upload.js";
import { verifyToken } from "../middleware/auth.js";
import { uploadResumeController } from "../controllers/resumeController.js";

const router = express.Router();

router.post("/upload", verifyToken, uploadResume.single("resume"), uploadResumeController);

export default router;
