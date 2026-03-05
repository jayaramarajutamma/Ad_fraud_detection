import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Navbar from './Navbar';
import Ads from './pages/Ads'
import Home from './pages/Home'
import Login from './pages/Login';
import Register from './pages/Register';
import  AdvertiserDashboard from './pages/AdvertiserDashboard'
import CreateAd from "./pages/CreateAds"


function App() {
  return (
    <Router>
      <Navbar />
      <ToastContainer />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/Ads" element={<Ads />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/reports" element={<AdvertiserDashboard />} />
        <Route path="/ads" element={<Ads/>}/>
        <Route path="/create-ad" element={<CreateAd/>}/>
      </Routes>

    </Router>
  );
}

export default App;