import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./Navbar.css";
import logo from "../assets/wildLogo.png";

const Nav = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);

  const scrollToSection = (id) => {
    setOpen(false);
    if (location.pathname !== "/") {
      navigate("/");
      setTimeout(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    } else {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <nav className="nav">
      {/* LEFT */}
      <div className="nav-left" onClick={() => navigate("/")}>
        <img src={logo} alt="Logo" className="logo" />
        <span className="site-name">My Wild Trails</span>
      </div>

      {/* MENU */}
      <ul className={`nav-menu ${open ? "active" : ""}`}>
        <li onClick={() => scrollToSection("home")}>Home</li>
        <li onClick={() => navigate("/about-us")}>About</li>
        <li onClick={() => navigate("/gallery")}>Gallery</li>
        <li onClick={() => navigate("/blog")}>Blog</li>
        <li onClick={() => navigate("/contact")}>Connect</li>
      </ul>

      {/* HAMBURGER */}
      <div className="hamburger" onClick={() => setOpen(!open)}>
        <span></span>
        <span></span>
        <span></span>
      </div>
    </nav>
  );
};

export default Nav;
