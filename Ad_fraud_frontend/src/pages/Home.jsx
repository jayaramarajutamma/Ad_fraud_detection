import React from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const Home = () => {

  const navigate = useNavigate();

  const handleAdsClick = () => {
    const isLoggedIn = localStorage.getItem("isLoggedIn");

    if (!isLoggedIn) {
      toast.warning("Please login first");
      navigate("/login");
    } else {
      navigate("/ads");
    }
  };

  return (
    <div style={pageStyle}>

      <div style={bgStyle} />

      <div style={overlayStyle} />

      <div style={contentWrapper}>

        <div style={glassCard}>

          <h1 style={titleStyle}>
            Intelligent Fraud Detection
          </h1>

          <h2 style={subtitleStyle}>
            ML Algorithms for Ad Click Security
          </h2>

          <p style={descStyle}>
            Detect fraudulent ad clicks in real-time using machine learning.
            Improve ad performance and prevent revenue loss with intelligent models.
          </p>

          <div style={btnGroup}>

            <button onClick={handleAdsClick} style={primaryBtn}>
              🚀 Start Viewing Ads
            </button>

            <button style={secondaryBtn} onClick={() => navigate("/about")}>
              Learn More
            </button>

          </div>

        </div>

      </div>

    </div>
  );
};

export default Home;


const pageStyle = {
  height: "100vh",
  position: "relative",
  overflow: "hidden",
  fontFamily: "DM Sans"
};

const bgStyle = {
  position: "absolute",
  width: "100%",
  height: "100%",
  backgroundImage: 'url("https://images.unsplash.com/photo-1550751827-4bd374c3f58b")',
  backgroundSize: "cover",
  backgroundPosition: "center",
  filter: "brightness(0.7)"
};

const overlayStyle = {
  position: "absolute",
  width: "100%",
  height: "100%",
  background: `
    linear-gradient(
      135deg,
      rgba(6, 20, 24, 0.85),
      rgba(15, 40, 45, 0.85),
      rgba(20, 60, 55, 0.75)
    )
  `
};

const contentWrapper = {
  position: "relative",
  zIndex: 2,
  height: "100%",
  display: "flex",
  alignItems: "center",
  paddingLeft: "80px"
};

const glassCard = {
  maxWidth: "550px",
  padding: "40px",
  borderRadius: "16px",
  background: "rgba(255,255,255,0.05)",
  backdropFilter: "blur(12px)",
  border: "1px solid rgba(255,255,255,0.1)",
  boxShadow: "0 10px 40px rgba(0,0,0,0.4)"
};

const titleStyle = {
  fontSize: "46px",
  fontWeight: "700",
  color: "#f9fafb",
  marginBottom: "10px"
};

const subtitleStyle = {
  fontSize: "24px",
  color: "#d1d5db",
  marginBottom: "20px"
};

const descStyle = {
  fontSize: "15px",
  color: "#9ca3af",
  marginBottom: "30px",
  lineHeight: "1.6"
};

const btnGroup = {
  display: "flex",
  gap: "15px"
};

const primaryBtn = {
  padding: "12px 24px",
  background: "linear-gradient(135deg, #22c55e, #16a34a)",
  border: "none",
  borderRadius: "8px",
  color: "#fff",
  fontWeight: "600",
  cursor: "pointer",
  boxShadow: "0 5px 20px rgba(34,197,94,0.4)"
};

const secondaryBtn = {
  padding: "12px 24px",
  background: "transparent",
  border: "1px solid rgba(255,255,255,0.3)",
  borderRadius: "8px",
  color: "#e5e7eb",
  cursor: "pointer"
};