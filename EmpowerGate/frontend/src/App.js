import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Admin from './pages/Admin';
import About from './pages/About';
import Search from './pages/Search';
import UserPortal from './pages/UserPortal'; // 🟢 Import User Dashboard
import './App.css'; 

function App() {
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
        <Navbar theme={theme} toggleTheme={toggleTheme} />
        <div className="content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/search" element={<Search />} />
            <Route path="/portal" element={<UserPortal />} /> {/* 🟢 Added User Dashboard Route */}
          </Routes>
        </div>
        <Footer />
      </div>
    </Router>
  );
}

export default App;