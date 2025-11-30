import express from "express";
import { verifyToken } from "../middleware/auth.js";
import { getJobFeed, swipeJob } from "../controllers/jobController.js";

const router = express.Router();

router.get("/feed", verifyToken, getJobFeed);
router.post("/swipe", verifyToken, swipeJob);

export default router;
