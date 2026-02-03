import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../App.css';

const API_URL = "https://empowergate-backend.onrender.com";

const Login = () => {
    const [formData, setFormData] = useState({ username: '', password: '' });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await axios.post(`${API_URL}/api/login`, formData);
            // 🟢 CRITICAL: Saving the 'key' your User Portal needs
            localStorage.setItem('empowerUser', JSON.stringify(res.data.user));
            alert("Login Successful!");
            navigate('/portal'); // Redirect straight to the portal
        } catch (err) {
            alert(err.response?.data?.message || "Login Failed. Check your backend logs.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container">
            <form onSubmit={handleSubmit} className="login-form">
                <h2>Citizen Login</h2>
                <input 
                    type="text" 
                    placeholder="Username" 
                    onChange={(e) => setFormData({...formData, username: e.target.value})} 
                    required 
                />
                <input 
                    type="password" 
                    placeholder="Password" 
                    onChange={(e) => setFormData({...formData, password: e.target.value})} 
                    required 
                />
                <button type="submit" disabled={loading}>
                    {loading ? "Authenticating..." : "Login to EmpowerGate"}
                </button>
                <p>Don't have an account? Contact Admin or Register.</p>
            </form>
        </div>
    );
};

export default Login;