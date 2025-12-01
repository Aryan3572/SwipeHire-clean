import express from "express";
import { verifyToken } from "../middleware/auth.js";
import { getProfile, deleteResume, getUserSwipes } from "../controllers/userController.js";

const router = express.Router();
router.get("/me", verifyToken, getProfile);
router.delete("/resume", verifyToken, deleteResume);
router.get("/swipes", verifyToken, getUserSwipes);

export default router;
