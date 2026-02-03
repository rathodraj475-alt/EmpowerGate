import React, { useState } from 'react';
import axios from 'axios';
import '../App.css';

const Admin = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  // Standard Admin Inputs
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [consent, setConsent] = useState(false);

  // 🔵 GOOGLE SIMULATION STATE
  const [showGoogleModal, setShowGoogleModal] = useState(false);
  const [googleStep, setGoogleStep] = useState(1); // 1 = Email, 2 = Password
  const [googleEmail, setGoogleEmail] = useState('');
  const [googlePass, setGooglePass] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Dashboard Data
  const [schemes, setSchemes] = useState([]);
  const [newScheme, setNewScheme] = useState({
    name: '', ministry: '', category: 'Citizens', state: 'All India', link: '',
    minAge: 18, maxAge: 60, gender: 'Any', incomeLimit: 0
  });

  // --- 🔐 STANDARD LOGIN ---
  const handleLogin = (e) => {
    e.preventDefault();
    if (username === 'admin' && password === 'admin123') { 
      if (!consent) { alert("Please agree to the terms of use."); return; }
      setIsAuthenticated(true);
      fetchSchemes();
    } else {
      // ✅ FIXED: Secure Error Message
      alert('Invalid Username or Password');
    }
  };

  // --- 🔵 GOOGLE SIMULATION LOGIC ---
  const openGoogleModal = () => {
    setShowGoogleModal(true);
    setGoogleStep(1); // Reset to email step
    setGoogleEmail('');
    setGooglePass('');
    setShowPassword(false);
  };

  const handleGoogleNext = () => {
    if (googleStep === 1) {
      // Step 1: Validate Email
      if (googleEmail.includes('@') && googleEmail.includes('.')) {
        setIsLoading(true);
        setTimeout(() => { setIsLoading(false); setGoogleStep(2); }, 1000); // Fake loading
      } else {
        alert("Please enter a valid email address.");
      }
    } else {
      // Step 2: Validate Password
      if (googlePass.length > 0) {
        setIsLoading(true);
        setTimeout(() => { 
          setIsLoading(false); 
          setShowGoogleModal(false); // Close Modal
          setIsAuthenticated(true);  // LOG IN!
          fetchSchemes();
          alert(`✅ Welcome, ${googleEmail}!`);
        }, 1500); 
      } else {
        alert("Please enter your password.");
      }
    }
  };

  // --- 🛠️ DASHBOARD LOGIC ---
  const fetchSchemes = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/schemes');
      setSchemes(res.data);
    } catch (err) { console.error(err); }
  };

  const handleDelete = async (schemeName) => {
    if(!window.confirm(`Delete ${schemeName}?`)) return;
    try {
      await axios.delete(`http://localhost:5000/api/delete-scheme/${encodeURIComponent(schemeName)}`);
      fetchSchemes();
    } catch (err) { alert("Error deleting scheme"); }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/add-scheme', newScheme);
      alert('Scheme Added!');
      setNewScheme({ name: '', ministry: '', category: 'Citizens', state: 'All India', link: '', minAge: 18, maxAge: 60, gender: 'Any', incomeLimit: 0 });
      fetchSchemes();
    } catch (err) { alert("Error adding scheme"); }
  };

  // --- 🎨 RENDER ---
  if (!isAuthenticated) {
    return (
      <div className="login-container">
        
        {/* 🔵 FAKE GOOGLE MODAL OVERLAY */}
        {showGoogleModal && (
          <div className="modal-overlay">
            <div className="google-card">
              <span className="close-modal" onClick={() => setShowGoogleModal(false)}>&times;</span>
              
              {/* Google Logo */}
              <div className="google-logo">
                <span style={{color:'#4285F4'}}>G</span>
                <span style={{color:'#EA4335'}}>o</span>
                <span style={{color:'#FBBC05'}}>o</span>
                <span style={{color:'#4285F4'}}>g</span>
                <span style={{color:'#34A853'}}>l</span>
                <span style={{color:'#EA4335'}}>e</span>
              </div>

              {isLoading ? (
                <div style={{padding:'40px'}}>
                  <div style={{border:'4px solid #f3f3f3', borderTop:'4px solid #3498db', borderRadius:'50%', width:'30px', height:'30px', animation:'spin 1s linear infinite', margin:'0 auto'}}></div>
                  <style>{`@keyframes spin {0% {transform: rotate(0deg);} 100% {transform: rotate(360deg);}}`}</style>
                </div>
              ) : (
                <>
                  <div className="google-sub">{googleStep === 1 ? "Sign in" : "Welcome"}</div>
                  {googleStep === 2 && (
                    <div style={{border:'1px solid #ddd', borderRadius:'20px', padding:'5px 10px', display:'inline-block', fontSize:'14px', marginBottom:'20px'}}>
                      👤 {googleEmail}
                    </div>
                  )}

                  <div style={{textAlign:'left'}}>
                    {googleStep === 1 ? (
                      <>
                        <p style={{margin:0, fontSize:'16px'}}>Use your Google Account</p>
                        <input 
                          className="google-input" 
                          placeholder="Email or phone" 
                          value={googleEmail} 
                          onChange={(e) => setGoogleEmail(e.target.value)}
                          autoFocus
                        />
                        <a href="https://accounts.google.com/signin/v2/recoveryidentifier" target="_blank" rel="noopener noreferrer" style={{color:'#1a73e8', textDecoration:'none', fontSize:'14px', fontWeight:'500'}}>Forgot email?</a>
                      </>
                    ) : (
                      <>
                        <input 
                          className="google-input" 
                          type={showPassword ? "text" : "password"} 
                          placeholder="Enter your password" 
                          value={googlePass} 
                          onChange={(e) => setGooglePass(e.target.value)}
                          autoFocus
                        />
                        <div style={{display:'flex', alignItems:'center', gap:'10px'}}>
                           <input 
                             type="checkbox" 
                             checked={showPassword} 
                             onChange={() => setShowPassword(!showPassword)} 
                           /> 
                           <span style={{fontSize:'14px'}}>Show password</span>
                        </div>
                      </>
                    )}
                  </div>

                  <div style={{marginTop:'40px', fontSize:'14px', color:'#5f6368', textAlign:'left'}}>
                    Not your computer? Use Guest mode to sign in privately. 
                    <a href="https://support.google.com/chrome/answer/6130773" target="_blank" rel="noopener noreferrer" style={{color:'#1a73e8', textDecoration:'none', marginLeft:'5px'}}>Learn more</a>
                  </div>

                  <div className="google-actions">
                    <div className="google-create">Create account</div>
                    <button className="google-next-btn" onClick={handleGoogleNext}>Next</button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
        {/* END GOOGLE MODAL */}

        <div className="login-card">
          <div style={{marginBottom:'20px'}}>
             <h2 style={{color:'var(--primary-color)', margin:0}}>EmpowerGate</h2>
             <p style={{margin:0, color:'#666', fontSize:'0.9rem'}}>Official Access Portal</p>
          </div>

          <h3 className="login-title">Sign In</h3>

          <form onSubmit={handleLogin}>
            <input className="login-input" type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
            <input className="login-input" type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
            
            <div style={{textAlign:'left', marginBottom:'20px', fontSize:'0.9rem', display:'flex', gap:'10px'}}>
              <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} />
              <label>I consent to terms of use.</label>
            </div>

            <button type="submit" className="btn-login-green">Secure Login</button>
          </form>

          <div style={{margin:'20px 0', position:'relative'}}>
            <hr style={{border:'0', borderTop:'1px solid #ddd'}}/>
            <span style={{position:'absolute', top:'-12px', left:'50%', transform:'translateX(-50%)', background:'white', padding:'0 10px', color:'#999', fontSize:'0.8rem'}}>OR</span>
          </div>

          <button onClick={openGoogleModal} style={{
            width:'100%', padding:'10px', background:'white', border:'1px solid #ddd', borderRadius:'5px', display:'flex', alignItems:'center', justifyContent:'center', gap:'10px', cursor:'pointer', fontWeight:'bold', color:'#555'
          }}>
            <span style={{color:'#4285F4', fontSize:'1.2rem', fontWeight:'bold'}}>G+</span> Sign in with Google
          </button>

          <div className="login-footer">
             <p style={{marginTop:'15px'}}>By logging in, you agree to our <span style={{color:'var(--primary-color)'}}>Privacy Policy</span></p>
          </div>
        </div>
      </div>
    );
  }

  // DASHBOARD
  return (
    <div className="container" style={{paddingTop:'20px'}}>
      <div className="dashboard-header">
        <div><h2 style={{margin:0}}>🛠️ Admin Dashboard</h2><p style={{margin:0, opacity:0.8}}>Manage Government Schemes</p></div>
        <button onClick={() => setIsAuthenticated(false)} style={{background:'rgba(255,255,255,0.2)', color:'white', border:'none', padding:'8px 15px', borderRadius:'5px', cursor:'pointer'}}>Logout ↪</button>
      </div>

      <div className="admin-grid">
        <div className="admin-card">
          <h3 style={{marginTop:0, borderBottom:'2px solid var(--bg-color)', paddingBottom:'10px'}}>➕ Add New Scheme</h3>
          <form onSubmit={handleAdd} style={{display:'flex', flexDirection:'column', gap:'10px'}}>
            <label>Scheme Name</label><input className="login-input" value={newScheme.name} onChange={(e) => setNewScheme({...newScheme, name: e.target.value})} required />
            <label>Ministry</label><input className="login-input" value={newScheme.ministry} onChange={(e) => setNewScheme({...newScheme, ministry: e.target.value})} required />
            <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'10px'}}>
               <div><label>Category</label><select className="login-input" value={newScheme.category} onChange={(e) => setNewScheme({...newScheme, category: e.target.value})}><option>Citizens</option><option>Farmers</option><option>Students</option><option>Women</option><option>Business</option></select></div>
               <div><label>State</label><select className="login-input" value={newScheme.state} onChange={(e) => setNewScheme({...newScheme, state: e.target.value})}><option>All India</option><option>Gujarat</option><option>Maharashtra</option></select></div>
            </div>
            <label>Official Link</label><input className="login-input" value={newScheme.link} onChange={(e) => setNewScheme({...newScheme, link: e.target.value})} required />
            <button type="submit" className="btn-login-green">Add Scheme</button>
          </form>
        </div>

        <div className="admin-card">
          <h3 style={{marginTop:0, borderBottom:'2px solid var(--bg-color)', paddingBottom:'10px'}}>📚 Database ({schemes.length})</h3>
          <div style={{maxHeight:'500px', overflowY:'auto'}}>
            {schemes.map((s, idx) => (
              <div key={idx} className="scheme-list-item">
                 <div><strong style={{display:'block'}}>{s.name.en || s.name}</strong><span style={{fontSize:'0.85rem', color:'#666'}}>{s.category} • {s.state}</span></div>
                 <button className="delete-btn" onClick={() => handleDelete(s.name.en || s.name)}>🗑</button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;