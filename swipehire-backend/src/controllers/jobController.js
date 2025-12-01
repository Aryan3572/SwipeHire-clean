import axios from "axios";
import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";
dotenv.config();

const prisma = new PrismaClient();

const JSEARCH_URL = "https://jsearch.p.rapidapi.com/search";

export const getJobFeed = async (req, res) => {
  try {
    const userId = req.userId;

    const user = await prisma.user.findUnique({ where: { id: userId } });
    const userSkills = user?.skills || [];

    const query =
      userSkills.length > 0
        ? `${userSkills.join(" ")} developer`
        : "software developer";

    const response = await axios.get(JSEARCH_URL, {
      params: { query, num_pages: 1 },
      headers: {
        "X-RapidAPI-Key": process.env.JSEARCH_API_KEY,
        "X-RapidAPI-Host": "jsearch.p.rapidapi.com",
      },
    });

    const jobs = response.data.data;

    const scoredJobs = jobs.map((job) => {
      const jobSkills = (job.job_required_skills || []).map((s) =>
        s.toLowerCase()
      );
      const matched = userSkills.filter((s) =>
        jobSkills.includes(s.toLowerCase())
      );

      const score =
        userSkills.length > 0
          ? Math.floor((matched.length / userSkills.length) * 100)
          : 10;

      return { ...job, matchScore: score };
    });

    res.json(scoredJobs);
  } catch (err) {
    console.error("Job Fetch Error:", err);
    res.status(500).json({ error: "Cannot fetch job data" });
  }
};

export const swipeJob = async (req, res) => {
  try {
    const { jobId, action } = req.body;
    const userId = req.userId;

    if (!jobId || !action)
      return res.status(400).json({ msg: "Missing jobId or action" });

    const swipe = await prisma.swipedJob.create({
      data: { jobId, userId, action },
    });

    res.json({ msg: "Swipe saved", swipe });
  } catch (err) {
    console.error("Swipe Error:", err);
    res.status(500).json({ error: "Error saving swipe" });
  }
};
