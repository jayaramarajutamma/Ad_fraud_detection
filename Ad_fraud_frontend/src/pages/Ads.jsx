import React from "react";

const Ads = () => {

  const ads = [
    { id: 1, title: "Buy iPhone 15", desc: "Latest Apple smartphone", img: "https://via.placeholder.com/200", app: 10, channel: 1 },
    { id: 2, title: "Nike Shoes", desc: "Comfort & Style", img: "https://via.placeholder.com/200", app: 20, channel: 2 },
    { id: 3, title: "Laptop Sale", desc: "Up to 40% OFF", img: "https://via.placeholder.com/200", app: 30, channel: 1 },
    { id: 4, title: "Headphones", desc: "Best Sound Quality", img: "https://via.placeholder.com/200", app: 40, channel: 3 }
  ];

  const cardStyle = {
    background: "#fff",
    padding: "15px",
    borderRadius: "10px",
    width: "220px",
    boxShadow: "0 4px 10px rgba(0,0,0,0.15)",
    cursor: "pointer",
    textAlign: "center",
    transition: "0.3s"
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

    console.log("Sending data to server:", clickData);

    try {
      const response = await fetch("http://127.0.0.1:5000/ad-click", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(clickData)
      });

      const data = await response.json();
      console.log("Server Response:", data);

    } catch (error) {
      console.error("Error connecting to server:", error);
    }
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Ads</h2>

      <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
        {ads.map((ad) => (
          <div
            key={ad.id}
            style={cardStyle}
            onClick={() => handleAdClick(ad)}
            onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.05)"}
            onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
          >
            <img src={ad.img} alt={ad.title} style={{ width: "100%" }} />
            <h3>{ad.title}</h3>
            <p>{ad.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Ads;