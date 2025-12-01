// src/controllers/resumeController.js
import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";

const prisma = new PrismaClient();

export const uploadResumeController = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ msg: "No file uploaded" });

    const userId = req.userId;
    const filePath = req.file.path;

    // Dynamic import (works in ESM) and pick default export if present
    let pdf;
    try {
      const mod = await import("pdf-parse");
      pdf = mod.default ?? mod;
    } catch (e) {
      console.error("Failed to import pdf-parse:", e);
      return res.status(500).json({ error: "Server: pdf-parse not available" });
    }

    // Read PDF file as buffer
    const buffer = fs.readFileSync(filePath);

    // Parse
    let data;
    try {
      data = await pdf(buffer);
    } catch (e) {
      console.error("Error during pdf parsing:", e);
      return res.status(500).json({ error: "Server: error parsing PDF" });
    }

    const fullText = (data?.text || "").toLowerCase();

    // Expand skill list as required
    const skillsList = [
      "javascript","java","python","react","node","express","sql","postgres",
      "postgresql","mongodb","c++","c","c#","html","css","aws","docker",
      "kubernetes","typescript","next","angular","rest","graphql","django",
      "flask","spring","linux"
    ];

    const foundSkills = skillsList.filter(skill => fullText.includes(skill));

    const updated = await prisma.user.update({
      where: { id: userId },
      data: {
        resumeUrl: filePath,
        skills: foundSkills,
      },
    });

    return res.json({
      msg: "Resume processed successfully",
      resumePath: filePath,
      skills: foundSkills,
      user: { id: updated.id, email: updated.email }
    });

  } catch (err) {
    console.error("Resume Error:", err);
    return res.status(500).json({ error: "Error processing resume" });
  }
};
