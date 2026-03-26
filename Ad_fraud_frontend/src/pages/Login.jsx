import React,{useState} from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const Login = () => {

  const navigate = useNavigate();

  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");

  const handleLogin = async () => {
    if(!email || !password){
    toast.error("Email and Password are required");
    return;
  }

    const response = await fetch("http://127.0.0.1:5000/login",{
      method:"POST",
      headers:{ "Content-Type":"application/json" },
      body:JSON.stringify({email,password})
    });

    const data = await response.json();

    if(data.success){

      localStorage.setItem("isLoggedIn","true");

      toast.success("Login successful");

      setTimeout(()=>{
        window.location.href="/";
      },500);

    }else{
      toast.error("Invalid credentials");
    }
  };

  return (
  <div style={page}>

    <div style={card}>

      <h2 style={title}>Login</h2>

      <input
        type="email"
        placeholder="Email"
        style={input}
        onChange={(e)=>setEmail(e.target.value)}
      />

      <input
        type="password"
        placeholder="Password"
        style={input}
        onChange={(e)=>setPassword(e.target.value)}
      />

      <button style={button} onClick={handleLogin}>
        Login
      </button>

      <p style={{textAlign:'center', marginTop:"15px"}}>
        Don't have an account?{" "}
        <span
          style={link}
          onClick={()=>navigate('/register')}
        >
          Register
        </span>
      </p>

    </div>
  </div>
);
};

const page = {
  height: "100vh",
  width: "100vw",   
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  background: "linear-gradient(135deg,#061418,#0f2d2f,#123c3a)",
  fontFamily: "DM Sans",
  overflow: "hidden"
};

const card = {
  margin: "0 auto",
  background: "rgba(255,255,255,0.05)",
  backdropFilter: "blur(15px)",
  border: "1px solid rgba(255,255,255,0.1)",
  padding: "40px",
  width: "320px",
  borderRadius: "16px",
  boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
  color: "#fff"
};

const title = {
  textAlign: "center",
  marginBottom: "20px"
};

const input = {
  width: "100%",
  padding: "12px",
  margin: "10px 0",
  borderRadius: "8px",
  border: "1px solid rgba(255,255,255,0.2)",
  background: "rgba(255,255,255,0.05)",
  color: "#fff",
  outline: "none"
};

const button = {
  width: "100%",
  padding: "12px",
  background: "#22c55e",
  border: "none",
  borderRadius: "8px",
  color: "#fff",
  fontWeight: "600",
  cursor: "pointer",
  marginTop: "10px"
};

const link = {
  color: "#f59e0b",
  cursor: "pointer",
  fontWeight: "500"
};

export default Login;