import React from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const Home = () => {

  const navigate = useNavigate();

  const handleAdsClick = () => {

    const isLoggedIn = localStorage.getItem("isLoggedIn");

    if(!isLoggedIn){
      toast.warning("Please login first");
      navigate("/login");
    }else{
      navigate("/ads");
    }

  };

  return (
    <div>

      <div style={{
        height: '100vh',
        backgroundImage: 'url("https://images.unsplash.com/photo-1550751827-4bd374c3f58b")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        position: 'relative',
        color: 'white'
      }}>

        {/* Dark Overlay */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'rgba(0,0,0,0.6)'
        }} />

        {/* Content */}
        <div style={{
          position: 'relative',
          zIndex: 1,
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          paddingLeft: '60px'
        }}>

          <h1 style={{ fontSize: '48px', marginBottom: '10px' }}>
            Intelligent Fraud Detection
          </h1>

          <h2 style={{ fontSize: '28px', marginBottom: '20px' }}>
            ML Algorithms for Ad Click Security
          </h2>

          <p style={{ maxWidth: '500px', marginBottom: '30px' }}>
            Detect fraudulent ad clicks in real-time using machine learning. 
            Improve ad performance and prevent revenue loss.
          </p>

          <div style={{ display: 'flex', gap: '15px' }}>
            
            <button 
              onClick={handleAdsClick}
              style={{
                padding: '12px 25px',
                background: '#f5a623',
                color: '#000',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
                fontWeight: 'bold'
              }}
            >
              Start Viewing Ads
            </button>

            <button 
              style={{
                padding: '12px 25px',
                background: 'transparent',
                color: '#fff',
                border: '1px solid #fff',
                borderRadius: '5px',
                cursor: 'pointer'
              }}
            >
              Learn More
            </button>

          </div>

        </div>

      </div>

    </div>
  );
};

export default Home;