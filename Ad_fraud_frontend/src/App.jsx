import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Navbar from './Navbar';
import Ads from './pages/Ads'
import Home from './pages/Home'
import Login from './pages/Login';
import Register from './pages/Register';
import  AdvertiserDashboard from './pages/AdvertiserDashboard'


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
      </Routes>

    </Router>
  );
}

export default App;