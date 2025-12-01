import React from "react";

export default function JobCard({ job, onAction }) {
  return (
    <div className="job-card">
      <div className="job-card-head">
        <h3>{job.job_title || job.title}</h3>
        <span className="match">Match: {job.matchScore ?? 10}%</span>
      </div>
      <p className="company">{job.employer_name || job.company_name}</p>
      <p className="desc">{(job.job_description || job.description || "").slice(0, 220)}...</p>
      <div className="job-card-actions">
        <button onClick={() => onAction(job.job_id || job.id, "skip")} className="btn-skip">Skip</button>
        <button onClick={() => onAction(job.job_id || job.id, "like")} className="btn-like">Like</button>
      </div>
    </div>
  );
}
