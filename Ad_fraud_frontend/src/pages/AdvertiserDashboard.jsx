import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";




const statusBadge = (status) => {
  const map = {
    SERVING: "#22c55e",
    FRAUD: "#ef4444",
    PAUSED: "#f59e0b",
    BLOCKED: "#6b7280",
  };

  return (
    <span style={{
      background: map[status] || "#22c55e",
      color: "#fff",
      padding: "4px 10px",
      borderRadius: "6px",
      fontSize: "11px",
      fontWeight: "600"
    }}>
      {status}
    </span>
  );
};

const riskBadge = (risk) => {
  const map = {
    Low: "#22c55e",
    Medium: "#f59e0b",
    High: "#ef4444",
  };

  return (
    <span style={{ color: map[risk] || "#aaa", fontWeight: 600 }}>
      {risk}
    </span>
  );
};

export default function AdvertiserDashboard() {

  const navigate = useNavigate();

  const [sessions,setSessions] = useState([]);
  const [stats,setStats] = useState({});
  const [ads,setAds] = useState([]);

  useEffect(()=>{

    const loadData = async () => {

      const adsData = await fetch("http://127.0.0.1:5000/ad-performance").then(r=>r.json());
      const sessionsData = await fetch("http://127.0.0.1:5000/sessions").then(r=>r.json());

      setAds(adsData);
      setSessions(sessionsData);

      let total = 0;
      let fraud = 0;

      adsData.forEach(ad=>{
        total += ad.totalClicks;
        fraud += ad.fraudClicks;
      });

      const genuine = total - fraud;
      const fraud_rate = total ? ((fraud/total)*100).toFixed(2) : 0;

      setStats({ total, fraud, genuine, fraud_rate });
    };

    loadData();
    const interval = setInterval(loadData,5000);

    return ()=>clearInterval(interval);

  },[]);

  return (
    <div style={pageStyle}>

      <div style={container}>

        <h2 style={heading}>📊 Dashboard Overview</h2>

        {/* STATS */}
        <div style={statsGrid}>
          {[
            { label: "Total Clicks", value: stats.total || 0 },
            { label: "Genuine", value: stats.genuine || 0, color:"#22c55e" },
            { label: "Fraud", value: stats.fraud || 0, color:"#ef4444" },
            { label: "Fraud Rate", value: `${stats.fraud_rate || 0}%`, color:"#f59e0b" }
          ].map((s) => (
            <div key={s.label} style={glassCard}>
              <div style={statLabel}>{s.label}</div>
              <div style={{ ...statValue, color: s.color || "#fff" }}>
                {s.value}
              </div>
            </div>
          ))}
        </div>

        {/* AD PERFORMANCE */}
        <h3 style={subHeading}>📈 Ad Performance</h3>

        <div style={adsGrid}>
          {ads.map((ad)=>{

            const genuineClicks = ad.totalClicks - ad.fraudClicks;

            return(
              <div key={ad.name} style={glassCard}>

                <div style={adTitle}>{ad.name}</div>

                <div style={statRow}>
                  <Stat label="Total" value={ad.totalClicks} />
                  <Stat label="Genuine" value={genuineClicks} color="#22c55e" />
                  <Stat label="Fraud" value={ad.fraudClicks} color="#ef4444" />
                  <Stat label="Rate" value={ad.fraudRate} color="#f59e0b" />
                  <button onClick={()=>navigate(`/report/${ad.id}`)} style={btn}>
                    View Report
                  </button>
                </div>
                

              </div>
            );
          })}
        </div>

        {/* TABLE */}
        <h3 style={subHeading}>🕐 Recent Sessions</h3>

        <div style={tableWrapper}>
          <table style={table}>
            <thead>
              <tr>
                {["Time","Ad","Clicks","Status","Risk","Reason"].map(h=>(
                  <th key={h} style={th}>{h}</th>
                ))}
              </tr>
            </thead>

            <tbody>
              {sessions.map((s,i)=>(
                <tr key={i} style={tr}>
                  <td style={td}>{s.time}</td>
                  <td style={td}>{s.ad}</td>
                  <td style={td}>{s.clicks}</td>
                  <td style={td}>{statusBadge(s.status)}</td>
                  <td style={td}>{riskBadge(s.risk)}</td>

                  {/* ✅ NEW REASON COLUMN */}
                  <td style={td}>
                    {Array.isArray(s.reason)
                      ? s.reason.join(", ")
                      : (s.reason || "N/A")}
                  </td>

                </tr>
              ))}
            </tbody>

          </table>
        </div>

      </div>
    </div>
  );
}

/* ---------------- STYLES ---------------- */

const pageStyle = {
  minHeight: "100vh",
  padding: "100px 40px 40px",
  background: "linear-gradient(135deg,#061418,#0f2d2f,#123c3a)",
  fontFamily: "DM Sans"
};

const container = {
  maxWidth: "1100px",
  margin: "auto"
};

const heading = {
  color: "#f1f5f9",
  marginBottom: "25px"
};

const subHeading = {
  color: "#cbd5f5",
  margin: "30px 0 15px"
};

const statsGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))",
  gap: "20px"
};

const adsGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))",
  gap: "20px"
};

const btn = {
  padding: "10px 18px",
  borderRadius: "10px",
  border: "1px solid rgba(255,255,255,0.15)",
  background: "rgba(255,255,255,0.08)",
  backdropFilter: "blur(10px)",
  color: "#e5e7eb",
  fontSize: "13px",
  fontWeight: "600",
  cursor: "pointer",
  transition: "all 0.25s ease",
  boxShadow: "0 4px 20px rgba(0,0,0,0.3)"
};

const glassCard = {
  background: "rgba(255,255,255,0.05)",
  backdropFilter: "blur(12px)",
  border: "1px solid rgba(255,255,255,0.1)",
  borderRadius: "16px",
  padding: "20px",
  boxShadow: "0 10px 30px rgba(0,0,0,0.4)"
};

const statLabel = {
  color: "#9ca3af",
  fontSize: "12px",
  marginBottom: "8px"
};

const statValue = {
  fontSize: "28px",
  fontWeight: "700"
};

const adTitle = {
  color: "#fff",
  fontWeight: "600",
  marginBottom: "12px"
};

const statRow = {
  display: "flex",
  gap: "15px",
  flexWrap: "wrap"
};

const tableWrapper = {
  overflowX: "auto",
  background: "rgba(255,255,255,0.05)",
  borderRadius: "12px",
  padding: "10px"
};

const table = {
  width: "100%",
  borderCollapse: "collapse",
  color: "#e5e7eb"
};

const th = {
  textAlign: "left",
  padding: "10px",
  color: "#9ca3af",
  fontSize: "12px"
};

const td = {
  padding: "10px",
  borderTop: "1px solid rgba(255,255,255,0.05)"
};

const tr = {
  transition: "0.2s"
};

function Stat({ label, value, color }) {
  return (
    <div>
      <div style={{ fontSize: "11px", color: "#9ca3af" }}>{label}</div>
      <div style={{ fontWeight: "700", color: color || "#fff" }}>{value}</div>
    </div>
  );
}