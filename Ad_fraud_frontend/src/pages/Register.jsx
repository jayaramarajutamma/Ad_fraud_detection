import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const Register = () => {

  const navigate = useNavigate();

  const [name,setName] = useState("");
  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");

  const handleRegister = async () => {

    const response = await fetch("http://127.0.0.1:5000/register",{
      method:"POST",
      headers:{ "Content-Type":"application/json" },
      body:JSON.stringify({name,email,password})
    });

    const data = await response.json();
    console.log(data);

    const handleRegister = async () => {

  const response = await fetch("http://127.0.0.1:5000/register",{
    method:"POST",
    headers:{ "Content-Type":"application/json" },
    body:JSON.stringify({name,email,password})
  });

  const data = await response.json();

  if(data.message){

    localStorage.setItem("isLoggedIn","true");

    toast.success("Registration successful");

    setTimeout(()=>{
      window.location.href="/";
    },1500);
  }
};
  };

  return (
    <div style={container}>
      <div style={box}>

        <h2 style={{textAlign:'center'}}>Register</h2>

        <input type="text" placeholder="Full Name" style={inputStyle}
          onChange={(e)=>setName(e.target.value)} />

        <input type="email" placeholder="Email" style={inputStyle}
          onChange={(e)=>setEmail(e.target.value)} />

        <input type="password" placeholder="Password" style={inputStyle}
          onChange={(e)=>setPassword(e.target.value)} />

        <button style={buttonStyle} onClick={handleRegister}>
          Register
        </button>
        <p style={{textAlign:'center'}}>
          Already have an account?{" "}
          <span style={{color:'#f5a623',cursor:'pointer'}}
            onClick={()=>navigate('/login')}>
            Login
          </span>
        </p>

      </div>
    </div>
  );
};

const container={height:'100vh',display:'flex',justifyContent:'center',alignItems:'center'}
const box={background:'rgba(0,0,0,0.8)',padding:'40px',borderRadius:'10px',width:'300px',color:'#fff'}

const inputStyle={width:'100%',padding:'10px',margin:'10px 0'}
const buttonStyle={width:'100%',padding:'10px',background:'#f5a623',border:'none'}

export default Register;