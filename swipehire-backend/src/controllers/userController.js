// src/controllers/userController.js
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const getProfile = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.userId },
      select: { id: true, name: true, email: true, resumeUrl: true, skills: true, createdAt: true }
    });
    if (!user) return res.status(404).json({ msg: "User not found" });
    res.json(user);
  } catch (err) {
    console.error("Profile Error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

export const deleteResume = async (req, res) => {
  try {
    const updated = await prisma.user.update({
      where: { id: req.userId },
      data: { resumeUrl: null, skills: [] }
    });
    res.json({ msg: "Resume removed", user: { id: updated.id } });
  } catch (err) {
    console.error("Delete resume error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

export const getUserSwipes = async (req, res) => {
  try {
    const swipes = await prisma.swipedJob.findMany({ where: { userId: req.userId } });
    res.json(swipes);
  } catch (err) {
    console.error("Get swipes error:", err);
    res.status(500).json({ error: "Server error" });
  }
};
