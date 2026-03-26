import React, { useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export default function CreateAds() {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [img, setImg] = useState("");

  const createAd = async () => {
    const ad = { title, desc, img };

    const res = await fetch("http://127.0.0.1:5000/create-ad", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(ad)
    });

    const data = await res.json();

    toast.success(`Ad Created | App ${data.app} Channel ${data.channel} 🎉`);

    setTitle("");
    setDesc("");
    setImg("");

    setTimeout(() => {
      navigate("/ads");
    }, 1500);
  };

  return (
    <div style={pageStyle}>
      <div style={cardStyle}>

        <h2 style={headingStyle}>🚀 Create New Advertisement</h2>

        <div style={gridStyle}>

          {/* LEFT FORM */}
          <div>

            <label style={labelStyle}>Ad Title</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Example: Mobile Puzzle Game"
              style={inputStyle}
            />

            <label style={labelStyle}>Description</label>
            <textarea
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              placeholder="Write short ad description..."
              style={{ ...inputStyle, height: "100px" }}
            />

            <label style={labelStyle}>Image URL</label>
            <input
              value={img}
              onChange={(e) => setImg(e.target.value)}
              placeholder="https://example.com/ad-image.png"
              style={inputStyle}
            />

            <button onClick={createAd} style={buttonStyle}>
              ✨ Create Advertisement
            </button>

          </div>

          {/* RIGHT PREVIEW */}
          <div style={previewCard}>
            {img ? (
              <img src={img} alt="preview" style={imageStyle} />
            ) : (
              <div style={placeholderStyle}>📷 Image Preview</div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}

/* ---------------- STYLES ---------------- */

const pageStyle = {
  height: "100vh",              // full screen only
  paddingTop: "70px",           // exact navbar space (not too much)
  boxSizing: "border-box",      // prevents overflow
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontFamily: "DM Sans",
  background: "linear-gradient(135deg, #061418, #0f2d2f, #123c3a)",
  overflow: "hidden"            // 🚀 removes scroll completely
};

const cardStyle = {
  width: "900px",
  background: "rgba(255,255,255,0.05)",
  backdropFilter: "blur(12px)",
  borderRadius: "16px",
  padding: "35px",
  border: "1px solid rgba(255,255,255,0.1)",
  boxShadow: "0 10px 40px rgba(0,0,0,0.4)"
};

const headingStyle = {
  marginBottom: "25px",
  fontWeight: "700",
  fontSize: "22px",
  color: "#f1f5f9"
};

const gridStyle = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  columnGap: "30px",   // horizontal gap
  alignItems: "start"  // 🔥 prevents stretching
};

const inputStyle = {
  width: "100%",
  padding: "12px",
  marginTop: "6px",
  marginBottom: "15px",
  border: "1px solid rgba(255,255,255,0.15)",
  borderRadius: "8px",
  fontSize: "14px",
  background: "rgba(255,255,255,0.05)",
  color: "#fff",
  outline: "none"
};

const labelStyle = {
  fontSize: "13px",
  fontWeight: "600",
  color: "#cbd5e1"
};

const buttonStyle = {
  width: "100%",
  padding: "13px",
  background: "linear-gradient(135deg, #22c55e, #16a34a)",
  border: "none",
  borderRadius: "8px",
  color: "#fff",
  fontWeight: "600",
  cursor: "pointer",
  fontSize: "15px",
  boxShadow: "0 5px 20px rgba(34,197,94,0.4)"
};

const previewCard = {
  borderRadius: "12px",
  background: "rgba(255,255,255,0.05)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  height: "260px",
  border: "1px solid rgba(255,255,255,0.1)",
  
};

const imageStyle = {
  maxWidth: "100%",
  maxHeight: "100%",
  borderRadius: "10px",
  objectFit: "cover"
};

const placeholderStyle = {
  color: "#9ca3af",
  fontSize: "15px"
};