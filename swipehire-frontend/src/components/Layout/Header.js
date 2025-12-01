import React from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Header() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <header className="site-header">
      <div className="brand" onClick={() => navigate("/")}>SwipeHire</div>
      <nav>
        <Link to="/">Home</Link>
        {token ? <>
          <Link to="/dashboard">Dashboard</Link>
          <Link to="/profile">Profile</Link>
          <button className="btn-ghost" onClick={logout}>Logout</button>
        </> : <>
          <Link to="/login">Login</Link>
          <Link to="/register">Register</Link>
        </>}
      </nav>
    </header>
  );
}
