import React, { useEffect, useState } from "react";
import API from "../../api/api";
import JobCard from "./JobCard";
import ResumeUpload from "./ResumeUpload";
import { toast } from "react-toastify";

export default function Dashboard() {
  const [jobs, setJobs] = useState([]);
  const [user, setUser] = useState(null);

  const fetchFeed = async () => {
    try {
      const res = await API.get("/jobs/feed");
      setJobs(res.data);
    } catch (err) {
      console.error(err);
      toast.error("Could not fetch jobs");
    }
  };

  const handleAction = async (jobId, action) => {
    try {
      await API.post("/jobs/swipe", { jobId, action });
      toast.success(action === "like" ? "Saved job" : "Skipped");
    } catch (err) {
      console.error(err);
      toast.error("Action failed");
    }
  };

  useEffect(() => {
    fetchFeed();
    const getProfile = async () => {
      try {
        const r = await API.get("/user/me");
        setUser(r.data);
      } catch (e) { /* ignore */ }
    };
    getProfile();
  }, []);

  return (
    <div className="dashboard">
      <div className="left-col">
        <div className="welcome-card">
          <h2>Welcome back{user ? `, ${user.name}` : ""} 👋</h2>
          <p>Find jobs tailored to your skills and swipe to save the best ones.</p>
        </div>
        <ResumeUpload onUploaded={(d) => { toast.info("Skills extracted: " + (d.skills || []).join(", ")); }} />
      </div>

      <div className="jobs-col">
        <h3>Jobs for you</h3>
        {jobs.length === 0 ? <p>No jobs found yet</p> : jobs.map((job, idx) => (
          <JobCard key={idx} job={job} onAction={handleAction} />
        ))}
      </div>
    </div>
  );
}
