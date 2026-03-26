import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const Navbar = () => {

  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const status = localStorage.getItem("isLoggedIn");
    setIsLoggedIn(status === "true");
  }, []);

  const handleProtectedClick = (e) => {
    if (!isLoggedIn) {
      e.preventDefault();
      toast.warning("Please login first");
      navigate("/login");
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    setIsLoggedIn(false);
    toast.success("Logged out successfully");
    navigate("/login");
  };

  return (
    <header style={navStyle}>

      {/* LEFT - LOGO */}
      <div style={leftSection}>
        <Link to="/" style={logoStyle}>
          Ad_Fraud_Detection
        </Link>
      </div>

      {/* CENTER - LINKS */}
      <nav style={navLinks}>
        <NavItem to="/">Home</NavItem>
        <NavItem to="/ads" onClick={handleProtectedClick}>Ads</NavItem>
        <NavItem to="/reports" onClick={handleProtectedClick}>Reports</NavItem>
        <NavItem to="/about">About</NavItem>
        <NavItem to="/create-ad" onClick={handleProtectedClick}>Create Ad</NavItem>
      </nav>

      {/* RIGHT - USER */}
      <div style={rightSection}>
        <span style={userIcon}>👤</span>

        {!isLoggedIn ? (
          <Link to="/login">
            <button style={loginBtn}>Login</button>
          </Link>
        ) : (
          <button style={logoutBtn} onClick={handleLogout}>
            Logout
          </button>
        )}
      </div>

    </header>
  );
};

/* ---------------- NAV ITEM COMPONENT ---------------- */

const NavItem = ({ to, children, onClick }) => (
  <Link
    to={to}
    onClick={onClick}
    style={linkStyle}
    onMouseOver={(e) => (e.target.style.color = "#fff")}
    onMouseOut={(e) => (e.target.style.color = "#d1d5db")}
  >
    {children}
  </Link>
);

/* ---------------- STYLES ---------------- */

const navStyle = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: "12px 40px",
  position: "fixed",
  top: 0,
  width: "100%",
  zIndex: 1000,
  boxSizing: "border-box", // ✅ FIXES OVERFLOW

  background: "rgba(15, 40, 45, 0.6)",
  backdropFilter: "blur(10px)",
  WebkitBackdropFilter: "blur(10px)",
  borderBottom: "1px solid rgba(255,255,255,0.08)"
};

const leftSection = {
  display: "flex",
  alignItems: "center"
};

const navLinks = {
  display: "flex",
  gap: "30px",
  alignItems: "center"
};

const rightSection = {
  display: "flex",
  alignItems: "center",
  gap: "15px"
};

const logoStyle = {
  textDecoration: "none",
  color: "#f9fafb",
  fontWeight: "700",
  fontSize: "30px"
};

const linkStyle = {
  textDecoration: "none",
  color: "#d1d5db",
  fontWeight: "500",
  transition: "0.3s"
};

const userIcon = {
  fontSize: "18px",
  color: "#fff"
};

const loginBtn = {
  background: "linear-gradient(135deg, #22c55e, #16a34a)",
  color: "#fff",
  border: "none",
  padding: "8px 18px",
  borderRadius: "6px",
  cursor: "pointer",
  fontWeight: "600"
};

const logoutBtn = {
  background: "linear-gradient(135deg, #ef4444, #dc2626)",
  color: "#fff",
  border: "none",
  padding: "8px 18px",
  borderRadius: "6px",
  cursor: "pointer",
  fontWeight: "600"
};

export default Navbar;