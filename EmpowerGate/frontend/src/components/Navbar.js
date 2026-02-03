import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Logo from './Logo';

const Navbar = ({ theme, toggleTheme }) => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  // 🟢 CHECK LOGIN STATUS
  const user = localStorage.getItem('empowerUser');

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchTerm)}`);
      setSearchTerm(''); 
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('empowerUser');
    navigate('/login');
  };

  return (
    <nav className="navbar">
      {/* LEFT: Logo */}
      <Link to="/" className="logo-container">
        <Logo className="logo-icon" style={{color: 'var(--primary-color)'}} />
        <span className="logo-text">EmpowerGate</span>
      </Link>

      {/* MIDDLE: Search Bar */}
      <div className="nav-search-container">
        <form onSubmit={handleSearch} className="nav-search-form">
          <input
            type="text"
            className="nav-search-input"
            placeholder={t('search_placeholder')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button type="submit" className="nav-search-btn">🔍</button>
        </form>
      </div>

      {/* RIGHT: Links & Buttons */}
      <div className="nav-links">
        <Link to="/">{t('nav_home')}</Link>
        <Link to="/about">{t('nav_about')}</Link>
        
        {/* 🟢 NEW: Admin Link for easy access */}
        <Link to="/admin" style={{fontSize: '1.1rem', opacity: 1,fontWeight:'600'}}>Admin</Link>

        {/* Language Selector */}
        <div className="lang-wrapper">
          <span className="lang-icon">🌐</span>
          <select
            className="lang-select"
            onChange={(e) => changeLanguage(e.target.value)}
            value={i18n.language}
          >
            <option value="en">English</option>
            <option value="hi">हिंदी</option>
            <option value="gu">ગુજરાતી</option>
          </select>
        </div>

        {/* 🟢 DYNAMIC AUTH BUTTONS */}
        {!user ? (
          <>
            <Link to="/login" className="btn-login-outline" style={{marginRight: '10px'}}>Login</Link>
            <Link to="/register" className="btn-signin">Register</Link>
          </>
        ) : (
          <>
            <Link to="/portal" className="btn-signin">UserPortal</Link>
            <button onClick={handleLogout} className="logout-nav-btn" style={{background: 'none', border: '1px solid #ff4d4d', color: '#ff4d4d', padding: '5px 10px', borderRadius: '5px', cursor: 'pointer', marginLeft: '10px'}}>
              Logout
            </button>
          </>
        )}

        {/* Theme Toggle */}
        <button 
          className="theme-toggle" 
          onClick={toggleTheme} 
          title="Toggle Theme"
          style={{background:'none', border:'none', fontSize:'1.4rem', cursor:'pointer', marginLeft: '10px'}}
        >
          {theme === 'light' ? '🌙' : '☀️'}
        </button>
      </div>
    </nav>
  );
};

export default Navbar;