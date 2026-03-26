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
    <div style={{height:'100vh',display:'flex',justifyContent:'center',alignItems:'center'}}>

      <div style={{background:'rgba(0,0,0,0.8)',padding:'40px',width:'300px',color:'#fff'}}>

        <h2>Login</h2>

        <input type="email" placeholder="Email" style={inputStyle} required
          onChange={(e)=>setEmail(e.target.value)} />

        <input type="password" placeholder="Password" style={inputStyle} required
          onChange={(e)=>setPassword(e.target.value)} />

        <button style={buttonStyle} onClick={handleLogin}>
          Login
        </button>
        <p style={{textAlign:'center'}}>
          Don't have an account?{" "}
          <span style={{color:'#f5a623',cursor:'pointer'}}
            onClick={()=>navigate('/register')}>
            Register
          </span>
        </p>

      </div>
    </div>
  );
};

const inputStyle={width:'100%',padding:'10px',margin:'10px 0'}
const buttonStyle={width:'100%',padding:'10px',background:'#f5a623',cursor: 'pointer'}

export default Login;