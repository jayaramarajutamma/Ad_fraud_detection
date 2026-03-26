import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

const Ads = () => {

  const [ads, setAds] = useState([]);

  useEffect(() => {
    fetch("http://127.0.0.1:5000/ads")
      .then(res => res.json())
      .then(data => setAds(data));
  }, []);

  const handleAdClick = async (ad) => {

    const click_time = new Date().toISOString();
    const userAgent = navigator.userAgent;

    let device = "Desktop";
    if (/Mobi|Android/i.test(userAgent)) device = "Mobile";
    if (/Tablet|iPad/i.test(userAgent)) device = "Tablet";

    let os = "Unknown";
    if (userAgent.includes("Windows")) os = "Windows";
    else if (userAgent.includes("Android")) os = "Android";
    else if (userAgent.includes("iPhone") || userAgent.includes("iPad")) os = "iOS";
    else if (userAgent.includes("Mac")) os = "MacOS";
    else if (userAgent.includes("Linux")) os = "Linux";

    const clickData = {
      app: ad.app,
      channel: ad.channel,
      device,
      os,
      click_time
    };

    const fakeIP = randomIP();

    const response = await fetch("http://127.0.0.1:5000/ad-click", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Forwarded-For": fakeIP
      },
      body: JSON.stringify(clickData)
    });

    const data = await response.json();
    console.log(data);
  };

  function randomIP() {
    return `${Math.floor(Math.random()*255)}.${Math.floor(Math.random()*255)}.${Math.floor(Math.random()*255)}.${Math.floor(Math.random()*255)}`;
  }

  return (
    <div style={pageStyle}>

      <h2 style={titleStyle}>📊 Available Ads</h2>

      <div style={adsContainer}>
        {ads.map((ad) => (
          <div
            key={ad.id}
            style={cardStyle}
            onClick={() => handleAdClick(ad)}

            onMouseEnter={(e) => 
    e.currentTarget.style.transform = "translateY(-8px)"
  }

  onMouseLeave={(e) => 
    e.currentTarget.style.transform = "translateY(0)"
  }
          >

            <img
              src={ad.img}
              alt={ad.title}
              style={imageStyle}
            />

            <div style={{ padding: "15px" }}>
              <h3 style={cardTitle}>{ad.title}</h3>
              <p style={cardDesc}>{ad.desc}</p>
            </div>

          </div>
        ))}
      </div>

    </div>
  );
};

/* ---------------- STYLES ---------------- */

const pageStyle = {
  minHeight: "100vh",
  padding: "100px 60px 40px 60px", // top padding for navbar
  fontFamily: "DM Sans",
  background: "linear-gradient(135deg, #061418, #0f2d2f, #123c3a)"
};

const titleStyle = {
  color: "#f1f5f9",
  marginBottom: "30px",
  fontSize: "24px"
};

const adsContainer = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
  gap: "25px"
};

const cardStyle = {
  borderRadius: "16px",
  overflow: "hidden",
  cursor: "pointer",
  transition: "0.3s",
  background: "rgba(255,255,255,0.05)",
  backdropFilter: "blur(10px)",
  border: "1px solid rgba(255,255,255,0.1)",
  boxShadow: "0 10px 30px rgba(0,0,0,0.4)",
  transform: "translateY(0)"
};

const imageStyle = {
  width: "100%",
  height: "160px",
  objectFit: "cover"
};

const cardTitle = {
  color: "#f8fafc",
  marginBottom: "8px",
  fontSize: "16px"
};

const cardDesc = {
  color: "#9ca3af",
  fontSize: "14px"
};

export default Ads;