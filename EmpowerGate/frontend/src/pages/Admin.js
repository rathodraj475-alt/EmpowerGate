import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../App.css';

// 🟢 LIVE BACKEND URL
const API_URL = "https://empowergate-backend.onrender.com";

const Admin = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  // Standard Admin Inputs
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [consent, setConsent] = useState(false);

  // 🔵 GOOGLE SIMULATION STATE
  const [showGoogleModal, setShowGoogleModal] = useState(false);
  const [googleStep, setGoogleStep] = useState(1); 
  const [googleEmail, setGoogleEmail] = useState('');
  const [googlePass, setGooglePass] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Dashboard Data
  const [schemes, setSchemes] = useState([]);
  const [newScheme, setNewScheme] = useState({
    nameEn: '', nameHi: '',
    descEn: '', descHi: '',
    ministry: '', category: 'Citizens', state: 'All India', 
    link: '', minAge: 18, maxAge: 60, gender: 'Any'
  });

  // --- 🔐 STANDARD LOGIN ---
  const handleLogin = (e) => {
    e.preventDefault();
    // Professional Check
    if (username === 'admin' && password === 'admin123') { 
      if (!consent) { alert("Please agree to the terms of use."); return; }
      setIsAuthenticated(true);
      fetchSchemes();
    } else {
      alert('Invalid Username or Password');
    }
  };

  // --- 🔵 GOOGLE SIMULATION LOGIC ---
  const openGoogleModal = () => {
    setShowGoogleModal(true);
    setGoogleStep(1); 
    setGoogleEmail('');
    setGooglePass('');
  };

  const handleGoogleNext = () => {
    if (googleStep === 1) {
      if (googleEmail.includes('@')) {
        setIsLoading(true);
        setTimeout(() => { setIsLoading(false); setGoogleStep(2); }, 1000); 
      } else {
        alert("Enter a valid email.");
      }
    } else {
      setIsLoading(true);
      setTimeout(() => { 
        setIsLoading(false); 
        setShowGoogleModal(false); 
        setIsAuthenticated(true);  
        fetchSchemes();
      }, 1500); 
    }
  };

  // --- 🛠️ DASHBOARD LOGIC (Live API) ---
  const fetchSchemes = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/schemes`);
      setSchemes(res.data);
    } catch (err) { console.error("Fetch Error:", err); }
  };

  const handleDelete = async (schemeName) => {
    if(!window.confirm(`Delete ${schemeName}?`)) return;
    try {
      // Points to your backend route
      await axios.delete(`${API_URL}/api/delete-scheme/${encodeURIComponent(schemeName)}`);
      fetchSchemes();
    } catch (err) { alert("Error deleting scheme"); }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    // Format data for JSONB PostgreSQL columns
    const schemePayload = {
        name: { en: newScheme.nameEn, hi: newScheme.nameHi },
        description: { en: newScheme.descEn, hi: newScheme.descHi },
        ministry: newScheme.ministry,
        category: newScheme.category,
        state: newScheme.state,
        eligibility: { minAge: newScheme.minAge, maxAge: newScheme.maxAge, gender: newScheme.gender },
        link: newScheme.link
    };

    try {
      await axios.post(`${API_URL}/api/admin/add-scheme`, schemePayload);
      alert('✅ Scheme Added to Neon Database!');
      setNewScheme({ nameEn: '', nameHi: '', descEn: '', descHi: '', ministry: '', category: 'Citizens', state: 'All India', link: '', minAge: 18, maxAge: 60, gender: 'Any' });
      fetchSchemes();
    } catch (err) { alert("Error adding scheme"); }
  };

  // --- 🎨 RENDER ---
  if (!isAuthenticated) {
    return (
      <div className="login-container">
        {/* GOOGLE MODAL SIMULATION (Keep as is for presentation) */}
        {showGoogleModal && (
          <div className="modal-overlay">
            <div className="google-card">
              <span className="close-modal" onClick={() => setShowGoogleModal(false)}>&times;</span>
              <div className="google-logo">
                <span style={{color:'#4285F4'}}>G</span><span style={{color:'#EA4335'}}>o</span><span style={{color:'#FBBC05'}}>o</span><span style={{color:'#4285F4'}}>g</span><span style={{color:'#34A853'}}>l</span><span style={{color:'#EA4335'}}>e</span>
              </div>
              {isLoading ? (
                <div className="spinner"></div>
              ) : (
                <>
                  <div className="google-sub">{googleStep === 1 ? "Sign in" : "Welcome"}</div>
                  <input className="google-input" placeholder={googleStep === 1 ? "Email or phone" : "Password"} type={googleStep === 2 && !showPassword ? "password" : "text"} value={googleStep === 1 ? googleEmail : googlePass} onChange={(e) => googleStep === 1 ? setGoogleEmail(e.target.value) : setGooglePass(e.target.value)} />
                  <div className="google-actions">
                    <button className="google-next-btn" onClick={handleGoogleNext}>Next</button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        <div className="login-card">
          <h2>EmpowerGate Admin</h2>
          <form onSubmit={handleLogin}>
            <input className="login-input" type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
            <input className="login-input" type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
            <div className="consent-box">
              <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} />
              <label>Authorize Administrative Access</label>
            </div>
            <button type="submit" className="btn-login-green">Secure Login</button>
          </form>
          <button onClick={openGoogleModal} className="google-sim-btn">Sign in with Google</button>
        </div>
      </div>
    );
  }

  return (
    <div className="container" style={{paddingTop:'20px'}}>
      <div className="dashboard-header">
        <h2>🛡️ Admin Dashboard (Live)</h2>
        <button onClick={() => setIsAuthenticated(false)}>Logout</button>
      </div>

      <div className="admin-grid">
        <div className="admin-card">
          <h3>➕ Add New Scheme</h3>
          <form onSubmit={handleAdd} className="admin-form-flex">
            <input placeholder="Name (English)" value={newScheme.nameEn} onChange={e => setNewScheme({...newScheme, nameEn: e.target.value})} required />
            <input placeholder="Name (Hindi)" value={newScheme.nameHi} onChange={e => setNewScheme({...newScheme, nameHi: e.target.value})} required />
            <textarea placeholder="Description (English)" value={newScheme.descEn} onChange={e => setNewScheme({...newScheme, descEn: e.target.value})} />
            <input placeholder="Ministry" value={newScheme.ministry} onChange={e => setNewScheme({...newScheme, ministry: e.target.value})} required />
            <select value={newScheme.category} onChange={e => setNewScheme({...newScheme, category: e.target.value})}>
                <option>Citizens</option><option>Farmers</option><option>Students</option><option>Women</option><option>Business</option>
            </select>
            <input placeholder="Official Link" value={newScheme.link} onChange={e => setNewScheme({...newScheme, link: e.target.value})} required />
            <button type="submit" className="btn-login-green">Add to Neon DB</button>
          </form>
        </div>

        <div className="admin-card">
          <h3>📚 Cloud Database ({schemes.length})</h3>
          <div className="db-list">
            {schemes.map((s, idx) => (
              <div key={idx} className="scheme-list-item">
                 <div><strong>{s.name.en || s.name}</strong><br/><small>{s.category} | {s.state}</small></div>
                 <button onClick={() => handleDelete(s.name.en || s.name)}>🗑</button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;