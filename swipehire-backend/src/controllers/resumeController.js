// src/controllers/resumeController.js
import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";

const prisma = new PrismaClient();

export const uploadResumeController = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ msg: "No file uploaded" });

    const userId = req.userId;
    const filePath = req.file.path; // multer gives this
    const absolutePath = path.resolve(filePath);

    // Basic file type validation (just in case)
    if (!absolutePath.toLowerCase().endsWith(".pdf")) {
      return res.status(400).json({ msg: "Only PDF files are allowed" });
    }

    // Robust import: handle ESM default or CJS
    const pdfModule = await import("pdf-parse").catch((e) => {
      console.error("Failed to import pdf-parse:", e);
      throw new Error("pdf-parse import failed");
    });
    const pdf = pdfModule.default ?? pdfModule;

    // Read file buffer
    const buffer = fs.readFileSync(absolutePath);

    // Parse PDF (pdf should be a function)
    if (typeof pdf !== "function") {
      console.error("pdf-parse export is not a function, got:", typeof pdf, Object.keys(pdf || {}));
      throw new Error("pdf-parse invalid export");
    }

    const data = await pdf(buffer);

    const fullText = (data.text || "").toLowerCase();

    const skillsList = [
      "javascript", "java", "python", "react", "node",
      "express", "sql", "postgres", "mongodb", "c++",
      "c", "c#", "html", "css", "aws", "docker",
      "kubernetes", "typescript", "next", "angular"
    ];

    const foundSkills = skillsList.filter(skill => fullText.includes(skill));

    const updated = await prisma.user.update({
      where: { id: userId },
      data: {
        resumeUrl: filePath,
        skills: foundSkills,
      },
    });

    // optional: leave file on disk so it can be served from /uploads
    console.log(`Resume processed for user ${userId}. Skills found:`, foundSkills);

    return res.json({
      msg: "Resume processed successfully",
      resumePath: filePath,
      skills: foundSkills,
      user: { id: updated.id, email: updated.email }
    });

  } catch (err) {
    console.error("Resume Error:", err && err.message ? err.message : err);
    // return more actionable error to developer, but keep client message minimal
    return res.status(500).json({ error: "Error processing resume", detail: err.message ?? String(err) });
  }
};
