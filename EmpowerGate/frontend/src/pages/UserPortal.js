import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../App.css';

const UserPortal = () => {
    const [user, setUser] = useState(null);
    const [savedSchemes, setSavedSchemes] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // 1. Get logged-in user from LocalStorage
        const savedUser = localStorage.getItem('empowerUser');
        if (savedUser) {
            const userData = JSON.parse(savedUser);
            setUser(userData);
            fetchSavedSchemes(userData.username);
        } else {
            setLoading(false);
        }
    }, []);

    // 2. Fetch schemes specifically saved in Neon DB for this user
    const fetchSavedSchemes = async (username) => {
        try {
            const res = await axios.get(`http://localhost:5000/api/saved-schemes/${username}`);
            setSavedSchemes(res.data); // result.rows from Neon
        } catch (err) {
            console.error("Error fetching saved schemes:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('empowerUser');
        window.location.href = '/';
    };

    if (loading) return <div className="portal-container"><p>Loading your profile...</p></div>;

    if (!user) {
        return (
            <div className="portal-container" style={{ textAlign: 'center', padding: '50px' }}>
                <h2>Access Denied</h2>
                <p>Please login to view your portal.</p>
                <button onClick={() => window.location.href = '/'} className="btn-primary">Go to Login</button>
            </div>
        );
    }

    return (
        <div className="portal-container">
            <div className="portal-header">
                <div>
                    <h1>Welcome, {user.username}!</h1>
                    <p className="user-role-tag">{user.role === 'admin' ? '🛡️ Administrator' : '👤 Citizen Account'}</p>
                </div>
                <button onClick={handleLogout} className="logout-btn">Logout</button>
            </div>

            <div className="portal-grid">
                {/* SAVED SCHEMES SECTION */}
                <div className="portal-card">
                    <h3>❤️ Your Saved Schemes</h3>
                    <div className="saved-list">
                        {savedSchemes.length === 0 ? (
                            <p className="empty-msg">You haven't saved any schemes yet. Browse the map to find some!</p>
                        ) : (
                            savedSchemes.map((scheme, index) => (
                                <div key={index} className="saved-item">
                                    <span>{scheme.scheme_name}</span>
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
                    <hr />
                    <button className="edit-profile-btn" disabled>Edit Profile Settings</button>
                </div>
            </div>
        </div>
    );
};

export default UserPortal;