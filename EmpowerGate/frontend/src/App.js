import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Admin from './pages/Admin';
import About from './pages/About';
import Search from './pages/Search';
import UserPortal from './pages/UserPortal';
import Login from './pages/Login'; 
import Register from './pages/Register'; 
import './App.css'; 

function App() {
  // Theme management logic
  const storedTheme = localStorage.getItem('theme') || 'light';
  const [theme, setTheme] = useState(storedTheme);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  return (
    <Router>
      <div className="App">
        {/* Pass theme props to Navbar for the dark/light mode toggle */}
        <Navbar theme={theme} toggleTheme={toggleTheme} />
        
        <div className="content">
          <Routes>
            {/* Core Application Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/search" element={<Search />} />
            <Route path="/portal" element={<UserPortal />} />
            
            {/* 🟢 NEW: Authentication Routes to fix Access Denied */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Routes>
        </div>
        
        <Footer />
      </div>
    </Router>
  );
}

export default App;