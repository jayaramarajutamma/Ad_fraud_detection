import { useState } from "react";

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
  const [activeTab, setActiveTab] = useState("Analytics");

  const sessions = [
    {
      time: "2025-02-09 10:36:12",
      ad: "Mobile Puzzle",
      sessionId: "muzzler_374...",
      clicks: 3,
      minGap: "3.11s",
      maxGap: "7.42s",
      status: "SERVING",
      risk: "Low",
    },
    {
      time: "2025-07-04 10:31:37",
      ad: "New RPG Game",
      sessionId: "warrior_176...",
      clicks: 17,
      minGap: "0.78s",
      maxGap: "0.2s",
      status: "FRAUD",
      risk: "High",
    },
  ];

  const riskDistribution = [
    { label: "Low Risk", color: "#22c55e", value: 1, max: 10 },
    { label: "Medium Risk", color: "#f59e0b", value: 8, max: 10 },
    { label: "High Risk", color: "#ef4444", value: 1, max: 10 },
  ];

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
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ color: "#94a3b8", fontSize: 13 }}>GameStudio</span>
          <span
            style={{
              background: "#ef4444",
              color: "#fff",
              padding: "3px 10px",
              borderRadius: 4,
              fontSize: 12,
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Live ●
          </span>
        </div>
      </div>

      {/* Sub Nav */}
      <div
        style={{
          background: "#fff",
          borderBottom: "1px solid #e5e7eb",
          padding: "0 24px",
          display: "flex",
          gap: 8,
          alignItems: "center",
          height: 44,
        }}
      >
        {["Analytics", "My Ads"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              padding: "6px 16px",
              borderRadius: 6,
              border: "none",
              background: activeTab === tab ? "#3b82f6" : "transparent",
              color: activeTab === tab ? "#fff" : "#6b7280",
              fontWeight: 600,
              fontSize: 13,
              cursor: "pointer",
              transition: "all 0.15s",
            }}
          >
            {tab === "Analytics" ? "📊 " : "📋 "}{tab}
          </button>
        ))}
        <button
          style={{
            padding: "6px 16px",
            borderRadius: 6,
            border: "1.5px dashed #d1d5db",
            background: "transparent",
            color: "#9ca3af",
            fontWeight: 600,
            fontSize: 13,
            cursor: "pointer",
          }}
        >
          + Create Ad
        </button>
      </div>

      {/* Main Content */}
      <div style={{ padding: 20, maxWidth: 960, margin: "0 auto" }}>

        {/* Click Statistics */}
        <Section title="🖱️ Click Statistics">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }}>
            {[
              { label: "TOTAL CLICKS", value: "55", color: "#1e2433" },
              { label: "GENUINE CLICKS", value: "12", color: "#22c55e" },
              { label: "FRAUDULENT CLICKS", value: "43", color: "#ef4444" },
              { label: "FRAUD RATE", value: "78.2%", color: "#ef4444" },
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
            {[
              { name: "New RPG Game", totalClicks: 33, fraudClicks: 27, impressionRate: "81.8%", fraudRate: null },
              { name: "Mobile Puzzle", totalClicks: 22, fraudClicks: 16, impressionRate: null, fraudRate: "72.7%" },
            ].map((ad) => (
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
                <div style={{ display: "flex", gap: 20 }}>
                  <Stat label="Total Clicks" value={ad.totalClicks} color="#1e2433" />
                  <Stat label="Fraud Clicks" value={ad.fraudClicks} color="#ef4444" />
                  <Stat
                    label="Fraud Rate"
                    value={ad.impressionRate || ad.fraudRate}
                    color="#f59e0b"
                  />
                </div>
              </div>
            ))}
          </div>
        </Section>

        {/* Recent Sessions */}
        <Section
          title="🕐 Recent Sessions"
          action={
            <span
              style={{
                fontSize: 11,
                color: "#3b82f6",
                background: "#eff6ff",
                padding: "3px 10px",
                borderRadius: 4,
                cursor: "pointer",
                fontWeight: 600,
              }}
            >
              See detail ON Live 12:00 PM
            </span>
          }
        >
          {/* Filter pills */}
          <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
            {["Visitors", "Auto Detected: 67%"].map((f, i) => (
              <span
                key={f}
                style={{
                  background: i === 0 ? "#1e2433" : "#dcfce7",
                  color: i === 0 ? "#fff" : "#166534",
                  padding: "3px 10px",
                  borderRadius: 4,
                  fontSize: 12,
                  fontWeight: 600,
                }}
              >
                {f}
              </span>
            ))}
            <span style={{ fontSize: 12, color: "#9ca3af", alignSelf: "center" }}>
              Auto-detection every 3 seconds
            </span>
          </div>

          {/* Table */}
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

        {/* Fraud Analysis */}
        <Section title="🔍 Fraud Analysis">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
            {/* Risk Distribution */}
            <div>
              <div style={{ fontWeight: 700, fontSize: 13, color: "#1e2433", marginBottom: 14 }}>
                Risk Distribution
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {riskDistribution.map((r) => (
                  <div key={r.label}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                      <span style={{ fontSize: 12, color: "#6b7280" }}>{r.label}</span>
                      <span style={{ fontSize: 12, fontWeight: 700, color: "#1e2433" }}>{r.value}</span>
                    </div>
                    <div
                      style={{
                        height: 8,
                        background: "#e5e7eb",
                        borderRadius: 4,
                        overflow: "hidden",
                      }}
                    >
                      <div
                        style={{
                          height: "100%",
                          width: `${(r.value / r.max) * 100}%`,
                          background: r.color,
                          borderRadius: 4,
                          transition: "width 0.6s ease",
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Financial Impact */}
            <div>
              <div style={{ fontWeight: 700, fontSize: 13, color: "#1e2433", marginBottom: 14 }}>
                Financial Impact
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {[
                  { label: "Cost per Click", value: "$0.50", color: "#1e2433" },
                  { label: "Money Lost to Fraud", value: "$21.50", color: "#ef4444" },
                  { label: "Money Saved", value: "$6.00", color: "#22c55e" },
                ].map((item) => (
                  <div
                    key={item.label}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      padding: "10px 14px",
                      background: "#f8fafc",
                      borderRadius: 8,
                      border: "1px solid #e5e7eb",
                    }}
                  >
                    <span style={{ fontSize: 13, color: "#6b7280" }}>{item.label}</span>
                    <span style={{ fontSize: 14, fontWeight: 800, color: item.color }}>
                      {item.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Section>
      </div>
    </div>
  );
}

function Section({ title, children, action }) {
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
        {action}
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
