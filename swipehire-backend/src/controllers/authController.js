import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const prisma = new PrismaClient();

export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!email || !password || !name) return res.status(400).json({ msg: "Missing fields" });

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) return res.status(400).json({ msg: "Email already exists" });

    const hash = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { name, email, password: hash },
    });

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: "7d" });
    res.json({ msg: "User registered", token, user: { id: user.id, name: user.name, email: user.email } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ msg: "Missing fields" });

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(404).json({ msg: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: "7d" });

    res.json({
      msg: "Login successful",
      token,
      user: { id: user.id, name: user.name, email: user.email, skills: user.skills || [] },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};
