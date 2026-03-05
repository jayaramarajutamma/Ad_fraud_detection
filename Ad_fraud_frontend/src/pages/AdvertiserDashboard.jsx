import { useState, useEffect } from "react";

const statusBadge = (status) => {

  const map = {
    SERVING: { bg: "#22c55e", label: "SERVING" },
    FRAUD: { bg: "#ef4444", label: "FRAUD" },
    PAUSED: { bg: "#f59e0b", label: "PAUSED" },
  };
  
  const s = map[status] || map["SERVING"];
  return (
    <span
      style={{
        background: s.bg,
        color: "#fff",
        padding: "2px 8px",
        borderRadius: 4,
        fontSize: 11,
        fontWeight: 700,
        letterSpacing: 0.5,
      }}
    >
      {s.label}
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
    <span style={{ color: map[risk] || "#666", fontWeight: 600, fontSize: 13 }}>
      {risk}
    </span>
  );
};

export default function AdvertiserDashboard() {

  const [sessions,setSessions] = useState([]);
  const [stats,setStats] = useState({});
  const [ads,setAds] = useState([]);

  useEffect(()=>{

  const loadData = async () => {

    const adsData = await fetch("http://127.0.0.1:5000/ad-performance")
    .then(r=>r.json())

    const sessionsData = await fetch("http://127.0.0.1:5000/sessions")
    .then(r=>r.json())

    setAds(adsData)
    setSessions(sessionsData)

    // calculate overall stats from ads
    let total = 0
    let fraud = 0

    adsData.forEach(ad=>{
      total += ad.totalClicks
      fraud += ad.fraudClicks
    })

    const genuine = total - fraud
    
    const fraud_rate = total ? ((fraud/total)*100).toFixed(2) : 0

    setStats({
      total,
      fraud,
      genuine,
      fraud_rate
    })
  }

  loadData()

  const interval = setInterval(loadData,5000)

  return ()=>clearInterval(interval)

},[])

  return (
    <div
      style={{
        fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
        background: "#f0f2f5",
        minHeight: "100vh",
        padding: 0,
      }}
    >

      {/* Top Nav */}
      <div
        style={{
          background: "#1e2433",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 24px",
          height: 52,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div
            style={{
              width: 28,
              height: 28,
              background: "#3b82f6",
              borderRadius: 6,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#fff",
              fontWeight: 800,
              fontSize: 14,
            }}
          >
            A
          </div>
          <span
            style={{ color: "#fff", fontWeight: 700, fontSize: 16, letterSpacing: 0.3 }}
          >
            Advertiser Dashboard
          </span>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ padding: 20, maxWidth: 960, margin: "0 auto" }}>

        {/* Click Statistics */}
        <Section title="🖱️ Click Statistics">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }}>
            {[
              { label: "TOTAL CLICKS", value: stats.total || 0, color:"#1e2433"},
              { label: "GENUINE CLICKS", value: stats.genuine || 0, color:"#22c55e"},
              { label: "FRAUDULENT CLICKS", value: stats.fraud || 0, color:"#ef4444"},
              { label: "FRAUD RATE", value: `${stats.fraud_rate || 0}%`, color:"#ef4444"}
              ].map((stat) => (
              <div
                key={stat.label}
                style={{
                  background: "#f8fafc",
                  border: "1px solid #e5e7eb",
                  borderRadius: 10,
                  padding: "14px 18px",
                  textAlign: "center",
                }}
              >
                <div style={{ fontSize: 10, color: "#9ca3af", fontWeight: 600, letterSpacing: 0.8, marginBottom: 6 }}>
                  {stat.label}
                </div>
                <div style={{ fontSize: 28, fontWeight: 800, color: stat.color }}>
                  {stat.value}
                </div>
              </div>
            ))}
          </div>
        </Section>

        {/* Ad Performance */}
        <Section title="📈 Ad Performance">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            {
              ads.map((ad)=>{

              const genuineClicks = ad.totalClicks - ad.fraudClicks;

              return(

              <div
              key={ad.name}
              style={{
              background: "#f8fafc",
              border: "1px solid #e5e7eb",
              borderRadius: 10,
              padding: "14px 18px",
              }}
              >

              <div style={{ fontWeight: 700, fontSize: 14, color: "#1e2433", marginBottom: 10 }}>
              {ad.name}
              </div>

              <div style={{ display: "flex",gap: 18, flexWrap:"wrap" }}>
              <Stat label="Total Clicks" value={ad.totalClicks} color="#1e2433" />
              <Stat label="Genuine Clicks" value={genuineClicks} color="#22c55e" />
              <Stat label="Fraud Clicks" value={ad.fraudClicks} color="#ef4444" />
              <Stat label="Fraud Rate" value={ad.fraudRate} color="#f59e0b" />
              </div>

              </div>

              )
              })
            }
          </div>
        </Section>

        {/* Recent Sessions */}
        <Section title="🕐 Recent Sessions">
          
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
              <thead>
                <tr style={{ borderBottom: "1px solid #e5e7eb" }}>
                  {["Time", "Ad", "Session ID", "Clicks/Session", "Min Gap", "Max Gap", "Status", "Risk Level"].map(
                    (h) => (
                      <th
                        key={h}
                        style={{
                          textAlign: "left",
                          padding: "8px 10px",
                          color: "#9ca3af",
                          fontWeight: 600,
                          fontSize: 11,
                          letterSpacing: 0.5,
                        }}
                      >
                        {h}
                      </th>
                    )
                  )}
                </tr>
              </thead>
              <tbody>
                {sessions.map((s, i) => (
                  <tr
                    key={i}
                    style={{
                      borderBottom: "1px solid #f1f5f9",
                      background: i % 2 === 0 ? "#fff" : "#fafafa",
                    }}
                  >
                    <td style={{ padding: "9px 10px", color: "#4b5563" }}>{s.time}</td>
                    <td style={{ padding: "9px 10px", color: "#1e2433", fontWeight: 600 }}>{s.ad}</td>
                    <td style={{ padding: "9px 10px", color: "#6b7280" }}>{s.sessionId}</td>
                    <td style={{ padding: "9px 10px", color: "#1e2433", fontWeight: 700 }}>{s.clicks}</td>
                    <td style={{ padding: "9px 10px", color: "#6b7280" }}>{s.minGap}</td>
                    <td style={{ padding: "9px 10px", color: "#6b7280" }}>{s.maxGap}</td>
                    <td style={{ padding: "9px 10px" }}>{statusBadge(s.status)}</td>
                    <td style={{ padding: "9px 10px" }}>{riskBadge(s.risk)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </Section>

      </div>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div
      style={{
        background: "#fff",
        borderRadius: 12,
        border: "1px solid #e5e7eb",
        padding: "16px 20px",
        marginBottom: 16,
        boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 14,
        }}
      >
        <div style={{ fontWeight: 700, fontSize: 15, color: "#1e2433" }}>{title}</div>
      </div>
      {children}
    </div>
  );
}

function Stat({ label, value, color }) {
  return (
    <div>
      <div style={{ fontSize: 10, color: "#9ca3af", fontWeight: 600, letterSpacing: 0.5, marginBottom: 2 }}>
        {label}
      </div>
      <div style={{ fontSize: 22, fontWeight: 800, color }}>{value}</div>
    </div>
  );
}