import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useRef } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


import {
  BarChart, Bar, XAxis, YAxis, Tooltip,
  PieChart, Pie, Cell, Legend,
  LineChart, Line, CartesianGrid
} from "recharts";




export default function AdReport() {

  const reportRef = useRef();

  const { adId } = useParams();
  const navigate = useNavigate();

  const [data, setData] = useState(null);
  const [adName, setAdName] = useState("");

  const downloadPDF = async () => {

  toast.loading("Generating PDF...");   // 🔥 show loading

  try {

    const input = reportRef.current;

    const canvas = await html2canvas(input, {
      scale: 2,
      backgroundColor: null,
      useCORS: true
    });

    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF("p", "mm", "a4");

    const imgWidth = 210;
    const pageHeight = 295;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    let heightLeft = imgHeight;
    let position = 0;

    pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    while (heightLeft > 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    pdf.save(`Ad_Report_${adId}.pdf`);

    toast.dismiss(); // remove loading
    toast.success("PDF Downloaded ✅");

  } catch (err) {
    toast.dismiss();
    toast.error("Failed to generate PDF ❌");
  }
};

  useEffect(() => {

    // 🔥 Fetch report
    fetch(`http://127.0.0.1:5000/ad-report/${adId}`)
      .then(res => res.json())
      .then(setData);

    // 🔥 Fetch ad name
    fetch("http://127.0.0.1:5000/ad-performance")
      .then(res => res.json())
      .then(ads => {
        const found = ads.find(a => String(a.id) === adId);
        if (found) setAdName(found.name);
      });

  }, [adId]);

  if (!data) return <h2 style={{color:"#fff"}}>Loading...</h2>;

  const COLORS = ["#22c55e", "#ef4444"];


  return (
    <div style={page}>

      {/* 🔙 BACK BUTTON */}
      <button onClick={()=>navigate(-1)} style={backBtn}>
        ⬅ Back
      </button>

      <div ref={reportRef} style={{
        background: "#061418",   // 🔥 FORCE DARK BG
        padding: "20px",
        borderRadius: "12px"
      }}>
      {/* 🔥 TITLE */}
      <h2 style={heading}>
        📊 Report: {adName || `Ad ${adId}`}
      </h2>

      {/* ✅ BASIC STATS */}
      <div style={grid}>
        <Card title="Total Clicks" value={data.total} />
        <Card title="Fraud" value={data.fraud} color="#ef4444" />
        <Card title="Genuine" value={data.genuine} color="#22c55e" />
        <Card title="Fraud Rate" value={`${data.rate}%`} color="#f59e0b" />
      </div>

      {/* 🔥 CHART ROW */}
      <div style={chartRow}>

        {/* BAR */}
        <div style={chartCard}>
          <h3>Fraud vs Genuine</h3>
          <BarChart width={300} height={220} data={[
            { name: "Fraud", value: data.fraud },
            { name: "Genuine", value: data.genuine }
          ]}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="value" fill="#8884d8" />
          </BarChart>
        </div>

        {/* PIE */}
        <div style={chartCard}>
          <h3>Distribution</h3>
          <PieChart width={300} height={220}>
            <Pie
              data={[
                { name: "Genuine", value: data.genuine },
                { name: "Fraud", value: data.fraud }
              ]}
              dataKey="value"
              outerRadius={80}
            >
              <Cell fill="#22c55e" />
              <Cell fill="#ef4444" />
            </Pie>
            <Tooltip />
            <Legend /> {/* 🔥 shows color meaning */}
          </PieChart>
        </div>

      </div>

      {/* LINE */}
      <div style={chartCard}>
        <h3>Click Trend</h3>
        <LineChart width={600} height={250} data={data.trend}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="time" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="clicks" stroke="#22c55e" />
        </LineChart>
      </div>
      </div>
      <div style={{ textAlign: "center", marginTop: "30px" }}>
        <button onClick={downloadPDF} style={downloadBtn}>
          ⬇ Download Report
        </button>
      </div>
    </div>

    
  );
}

/* ---------------- COMPONENT ---------------- */

function Card({ title, value, color }) {
  return (
    <div style={card}>
      <div style={{ color:"#aaa", fontSize:"12px" }}>{title}</div>
      <div style={{ fontSize:"22px", color: color || "#fff" }}>{value}</div>
    </div>
  );
}

/* ---------------- STYLES ---------------- */

const page = {
  padding: "40px",
  background: "#061418",
  minHeight: "100vh",
  color: "#fff"
};

const heading = { marginBottom: "20px" };
const sub = { marginTop: "30px" };

const grid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit,minmax(150px,1fr))",
  gap: "15px"
};

const downloadBtn = {
  padding: "12px 20px",
  borderRadius: "10px",
  border: "none",
  background: "#3b82f6",
  color: "#fff",
  fontSize: "14px",
  fontWeight: "600",
  cursor: "pointer",
  transition: "0.3s"
};

const chartRow = {
  display: "flex",
  gap: "20px",
  flexWrap: "wrap",
  marginTop: "30px"
};

const chartCard = {
  background: "rgba(255,255,255,0.05)",
  padding: "20px",
  borderRadius: "12px",
  flex: "1 1 350px",     // ✅ responsive width
  minWidth: "300px",     // ✅ prevents squeezing
  marginBottom: "20px"   // ✅ vertical gap
};
const card = {
  background: "rgba(255,255,255,0.05)",
  padding: "20px",
  borderRadius: "12px"
};

const backBtn = {
  marginBottom: "20px",
  padding: "8px 15px",
  borderRadius: "8px",
  border: "none",
  background: "#22c55e",
  color: "#fff",
  cursor: "pointer"
};

const table = {
  marginTop: "10px",
  borderCollapse: "collapse"
};