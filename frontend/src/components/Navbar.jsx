import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "./Navbar.css";

const Navbar = () => {
  const navigate = useNavigate();
  const isAuth = !!localStorage.getItem("token");
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div className="navbar-content">
        <div className="navbar-brand" onClick={() => navigate("/employees")}>
          <span className="brand-icon">🏢</span>
          HRMS Connect
        </div>
        <button
          className="hamburger"
          aria-label="Toggle menu"
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span className={menuOpen ? "hamburger-bar active" : "hamburger-bar"}></span>
          <span className={menuOpen ? "hamburger-bar active" : "hamburger-bar"}></span>
          <span className={menuOpen ? "hamburger-bar active" : "hamburger-bar"}></span>
        </button>
        <div className={`navbar-links ${menuOpen ? "show" : ""}`}>
          {isAuth && (
            <>
              <NavLink className="nav-link" to="/dashboard">
                Dashboard
              </NavLink>
              <NavLink className="nav-link" to="/employees">
                Employees
              </NavLink>
              <NavLink className="nav-link" to="/teams">
                Teams
              </NavLink>
              <button className="nav-link logout" onClick={handleLogout}>
                Logout
              </button>
            </>
          )}
          {!isAuth && (
            <>
              <NavLink className="nav-link" to="/login">
                Login
              </NavLink>
              <NavLink className="nav-link register" to="/register">
                Register
              </NavLink>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
