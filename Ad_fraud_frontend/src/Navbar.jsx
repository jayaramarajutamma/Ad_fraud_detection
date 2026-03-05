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

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    setIsLoggedIn(false);
    toast.success("Logged out successfully");
    navigate("/login");
  };

  const handleAdsClick = (e) => {
    if (!isLoggedIn) {
      e.preventDefault();
      toast.warning("Please login first");
      navigate("/login");
    }
  };

  return (
    <header style={{
      display: 'flex',
      alignItems: 'center',
      padding: '0.5rem 2rem',
      background: '#f4f4f4',
      justifyContent: 'space-between'
    }}>

      <div style={{ display: 'flex', alignItems: 'center', gap: '30px' }}>

        <Link to="/" style={linkStyle}>
          <h1 style={{ margin: 0 }}>Ad_Fraud_Detection</h1>
        </Link>

        <nav style={{ display: 'flex', gap: '30px', marginLeft: '450px' }}>

          <Link to="/" style={linkStyle}>Home</Link>

          <Link to="/ads" style={linkStyle} onClick={handleAdsClick}>
            Ads
          </Link>

          <Link to="/reports" style={linkStyle}>Reports</Link>
          <Link to="/about" style={linkStyle}>About</Link>

        </nav>

      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>

        <span style={{ fontSize: '20px' }}>👤</span>

        {!isLoggedIn ? (
          <Link to="/login">
            <button style={buttonStyle}>
              Login / Signup
            </button>
          </Link>
        ) : (
          <button style={logoutStyle} onClick={handleLogout}>
            Logout
          </button>
        )}

      </div>

    </header>
  );
};

const linkStyle = {
  textDecoration: 'none',
  color: '#333',
  fontWeight: '500'
};

const buttonStyle = {
  backgroundColor: 'red',
  color: 'white',
  border: 'none',
  padding: '8px 20px',
  borderRadius: '4px',
  cursor: 'pointer'
};

const logoutStyle = {
  backgroundColor: 'green',
  color: 'white',
  border: 'none',
  padding: '8px 20px',
  borderRadius: '4px',
  cursor: 'pointer'
};

export default Navbar;