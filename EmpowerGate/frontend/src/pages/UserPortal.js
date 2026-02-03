import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../App.css';

// 🟢 LIVE BACKEND URL
const API_URL = "https://empowergate-backend.onrender.com";

const UserPortal = () => {
    const [user, setUser] = useState(null);
    const [savedSchemes, setSavedSchemes] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // 1. Get logged-in user from LocalStorage
        // 🛠️ IMPORTANT: Must match the key used in Search.js and Login.js
        const savedUser = localStorage.getItem('empowerUser');
        
        if (savedUser) {
            try {
                const userData = JSON.parse(savedUser);
                setUser(userData);
                fetchSavedSchemes(userData.username);
            } catch (error) {
                console.error("LocalStorage Parse Error:", error);
                setLoading(false);
            }
        } else {
            setLoading(false);
        }
    }, []);

    // 2. Fetch schemes from live Neon DB
    const fetchSavedSchemes = async (username) => {
        try {
            const res = await axios.get(`${API_URL}/api/saved-schemes/${username}`);
            setSavedSchemes(res.data); 
        } catch (err) {
            console.error("Error fetching saved schemes from live server:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('empowerUser');
        window.location.href = '/';
    };

    if (loading) return <div className="portal-container"><p>Loading your profile...</p></div>;

    // 🔴 ACCESS DENIED VIEW
    if (!user) {
        return (
            <div className="portal-container" style={{ textAlign: 'center', padding: '100px 20px' }}>
                <div style={{ fontSize: '50px' }}>🔐</div>
                <h2 style={{ color: 'var(--text-color)' }}>Access Denied</h2>
                <p style={{ color: 'var(--text-color)', opacity: 0.7 }}>Please login to view your saved schemes and profile.</p>
                <button 
                    onClick={() => window.location.href = '/login'} 
                    className="btn-primary"
                    style={{ marginTop: '20px', padding: '12px 30px' }}
                >
                    Go to Login
                </button>
            </div>
        );
    }

    return (
        <div className="portal-container">
            <div className="portal-header">
                <div>
                    <h1>Welcome, {user.username}!</h1>
                    <p className="user-role-tag">
                        {user.role === 'admin' ? '🛡️ Administrator' : '👤 Citizen Account'}
                    </p>
                </div>
                <button onClick={handleLogout} className="logout-btn">Logout</button>
            </div>

            <div className="portal-grid">
                {/* SAVED SCHEMES SECTION */}
                <div className="portal-card">
                    <h3>❤️ Your Saved Schemes</h3>
                    <div className="saved-list">
                        {savedSchemes.length === 0 ? (
                            <p className="empty-msg">You haven't saved any schemes yet. Go to the search page to find some!</p>
                        ) : (
                            savedSchemes.map((scheme, index) => (
                                <div key={index} className="saved-item">
                                    <span style={{ fontWeight: 'bold' }}>{scheme.scheme_name}</span>
                                    <button 
                                        className="view-btn"
                                        onClick={() => window.location.href = `/search?q=${encodeURIComponent(scheme.scheme_name)}`}
                                    >
                                        View →
                                    </button>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* PROFILE STATS */}
                <div className="portal-card">
                    <h3>📊 Profile Overview</h3>
                    <div className="stat-row">
                        <span>Account Status:</span>
                        <span className="status-active">Active</span>
                    </div>
                    <div className="stat-row">
                        <span>Total Saved:</span>
                        <span className="stat-count">{savedSchemes.length}</span>
                    </div>
                    <hr style={{ margin: '20px 0', opacity: 0.2 }} />
                    <button className="edit-profile-btn" disabled style={{ opacity: 0.5, cursor: 'not-allowed' }}>
                        Edit Profile Settings
                    </button>
                </div>
            </div>
        </div>
    );
};

export default UserPortal;