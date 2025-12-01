import React, { useState } from "react";
import API from "../../api/api";
import { toast } from "react-toastify";

export default function ResumeUpload({ onUploaded }) {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (!file) return toast.error("Pick a PDF first");
    const fd = new FormData();
    fd.append("resume", file);
    try {
      setLoading(true);
      const res = await API.post("/resume/upload", fd, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      toast.success("Resume uploaded");
      onUploaded(res.data);
    } catch (err) {
      console.error(err);
      toast.error(err?.response?.data?.error || "Upload failed");
    } finally { setLoading(false); }
  };

  return (
    <form className="upload-card" onSubmit={submit}>
      <h4>Upload Resume (PDF)</h4>
      <input type="file" accept="application/pdf" onChange={e => setFile(e.target.files[0])}/>
      <div className="upload-actions">
        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? "Uploading..." : "Upload"}
        </button>
      </div>
    </form>
  );
}
