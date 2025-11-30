import { PrismaClient } from "@prisma/client";
import fs from "fs";
import { createRequire } from "module";

// Load CommonJS module in ESM
const require = createRequire(import.meta.url);
const pdf = require("pdf-parse");

const prisma = new PrismaClient();

export const uploadResumeController = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ msg: "No file uploaded" });

    const userId = req.userId;
    const filePath = req.file.path;

    // Read PDF file
    const buffer = fs.readFileSync(filePath);
    const data = await pdf(buffer); // now works!
    
    const fullText = data.text.toLowerCase();

    const skillsList = [
      "javascript", "java", "python", "react", "node",
      "express", "sql", "postgres", "mongodb", "c++",
      "c", "c#", "html", "css", "aws", "docker",
      "kubernetes", "typescript", "next", "angular"
    ];

    const foundSkills = skillsList.filter(skill =>
      fullText.includes(skill)
    );

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
    console.error("❌ Resume error:", err);
    return res.status(500).json({ error: "Error processing resume" });
  }
};
