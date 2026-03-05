import React, { useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

let appCounter = 10;
let channelCounter = 1;

export default function CreateAds(){
  const navigate = useNavigate();

const [title,setTitle] = useState("")
const [desc,setDesc] = useState("")
const [img,setImg] = useState("")

const createAd = async () => {

const ad = {
title,
desc,
img
}

const res = await fetch("http://127.0.0.1:5000/create-ad",{
method:"POST",
headers:{
"Content-Type":"application/json"
},
body:JSON.stringify(ad)
})

const data = await res.json()

toast.success(`Ad Created | App ${data.app} Channel ${data.channel} 🎉`)

setTitle("")
setDesc("")
setImg("")

setTimeout(()=>{
navigate("/ads")
},1500)

}

return(

<div
style={{
background:"#f0f2f5",
minHeight:"100vh",
padding:"40px",
fontFamily:"DM Sans"
}}
>

<div
style={{
maxWidth:"900px",
margin:"auto",
background:"#fff",
borderRadius:"12px",
boxShadow:"0 4px 15px rgba(0,0,0,0.1)",
padding:"30px"
}}
>

<h2
style={{
marginBottom:"25px",
fontWeight:"700",
color:"#1e2433"
}}
>
Create New Advertisement
</h2>

<div
style={{
display:"grid",
gridTemplateColumns:"1fr 1fr",
gap:"20px"
}}
>

<div>

<label style={labelStyle}>Ad Title</label>

<input
value={title}
onChange={(e)=>setTitle(e.target.value)}
placeholder="Example: Mobile Puzzle Game"
style={inputStyle}
/>

<label style={labelStyle}>Description</label>

<textarea
value={desc}
onChange={(e)=>setDesc(e.target.value)}
placeholder="Write short ad description..."
style={{
...inputStyle,
height:"90px"
}}
/>

<label style={labelStyle}>Image URL</label>

<input
value={img}
onChange={(e)=>setImg(e.target.value)}
placeholder="https://example.com/ad-image.png"
style={inputStyle}
/>

<div
style={{
marginTop:"15px",
fontSize:"13px",
color:"#6b7280"
}}
>


</div>

<button
onClick={createAd}
style={{
marginTop:"20px",
width:"100%",
padding:"12px",
background:"#3b82f6",
border:"none",
borderRadius:"6px",
color:"#fff",
fontWeight:"600",
cursor:"pointer",
fontSize:"14px"
}}
>
Create Advertisement
</button>

</div>

{/* Image Preview */}

<div
style={{
border:"1px dashed #d1d5db",
borderRadius:"8px",
display:"flex",
alignItems:"center",
justifyContent:"center",
height:"250px",
background:"#fafafa"
}}
>

{img ? (

<img
src={img}
alt="preview"
style={{
maxWidth:"100%",
maxHeight:"100%",
borderRadius:"6px"
}}
/>

) : (

<span style={{color:"#9ca3af"}}>
Image Preview
</span>

)}

</div>

</div>

</div>

</div>

)

}

const inputStyle={
width:"100%",
padding:"10px",
marginTop:"6px",
marginBottom:"15px",
border:"1px solid #d1d5db",
borderRadius:"6px",
fontSize:"14px"
}

const labelStyle={
fontSize:"13px",
fontWeight:"600",
color:"#374151"
}