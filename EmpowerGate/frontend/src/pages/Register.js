import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../App.css';

// 🟢 LIVE BACKEND URL
const API_URL = "https://empowergate-backend.onrender.com";

const Register = () => {
    const [formData, setFormData] = useState({ username: '', password: '' });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            // Sends new user data to your PostgreSQL via Render
            await axios.post(`${API_URL}/api/register`, formData);
            alert("Registration Successful! Please login.");
            navigate('/login'); // Redirect to login page after success
        } catch (err) {
            alert(err.response?.data?.message || "Registration failed. Try a different username.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container">
            <form onSubmit={handleSubmit} className="login-form">
                <h2>Create Account</h2>
                <p style={{marginBottom: '20px', opacity: 0.7}}>Join EmpowerGate to save government schemes</p>
                
                <input 
                    type="text" 
                    placeholder="Choose Username" 
                    onChange={(e) => setFormData({...formData, username: e.target.value})} 
                    required 
                />
                <input 
                    type="password" 
                    placeholder="Create Password" 
                    onChange={(e) => setFormData({...formData, password: e.target.value})} 
                    required 
                />
                
                <button type="submit" disabled={loading} style={{background: 'var(--secondary-color)'}}>
                    {loading ? "Creating Account..." : "Register Now"}
                </button>
                
                <button 
                    type="button" 
                    onClick={() => navigate('/login')} 
                    style={{background: 'none', color: 'var(--primary-color)', border: 'none', marginTop: '10px', cursor: 'pointer'}}
                >
                    Already have an account? Login
                </button>
            </form>
        </div>
    );
};

export default Register;