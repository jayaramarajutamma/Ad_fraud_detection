import React, { useEffect, useState } from "react";

const Ads = () => {

  const [ads, setAds] = useState([]);

  useEffect(() => {
    fetch("http://127.0.0.1:5000/ads")
      .then(res => res.json())
      .then(data => setAds(data));
  }, []);

  const cardStyle = {
    background: "#ffffff",
    padding: "15px",
    borderRadius: "12px",
    width: "240px",
    boxShadow: "0 8px 20px rgba(0,0,0,0.1)",
    cursor: "pointer",
    textAlign: "center",
    transition: "all 0.25s ease",
    border: "1px solid #e5e7eb"
  };

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
      device: device,
      os: os,
      click_time: click_time
    };

    const response = await fetch("http://127.0.0.1:5000/ad-click", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(clickData)
    });

    const data = await response.json();
    console.log(data);
  };

  return (
    <div style={pageStyle}>

      <div style={adsContainer}>
        {ads.map((ad) => (
          <div
            key={ad.id}
            style={cardStyle}
            onClick={() => handleAdClick(ad)}
          >
            <img 
              src={ad.img} 
              alt={ad.title} 
              style={{
                width: "100%",
                height: "150px",
                objectFit: "cover",
                borderRadius: "8px"
              }} 
            />

            <h3 style={{margin:"10px 0 5px 0", color:"#1e293b"}}>
              {ad.title}
            </h3>

            <p style={{fontSize:"14px", color:"#64748b"}}>
              {ad.desc}
            </p>
          </div>
        ))}
      </div>

    </div>
  );
};

const pageStyle = {
  minHeight: "100vh",
  padding: "40px",
  fontFamily: "DM Sans",
  background: "linear-gradient(135deg,#eef2ff,#f8fafc,#e0f2fe)"
};

const headerStyle = {
  marginBottom: "30px"
};

const adsContainer = {
  display: "flex",
  gap: "25px",
  flexWrap: "wrap"
};

export default Ads;