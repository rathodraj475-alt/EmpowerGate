import React from 'react';
import { useTranslation } from 'react-i18next';

const About = () => {
    const { t } = useTranslation();

    const techStack = [
        { name: "React.js", icon: "⚛️", desc: "Frontend Interface" },
        { name: "Node.js", icon: "🟢", desc: "Backend Server" },
        { name: "PostgreSQL", icon: "🐘", desc: "Neon Cloud Database" },
        { name: "Express", icon: "🚀", desc: "API Routing" }
    ];

    return (
        <div className="about-container">
            {/* Project Vision */}
            <section className="about-hero">
                <h1>{t('nav_about')} EmpowerGate</h1>
                <p className="lead-text">
                    Bridging the gap between Indian citizens and government welfare. 
                    EmpowerGate is a centralized platform designed to simplify the discovery 
                    and eligibility tracking of government schemes.
                </p>
            </section>

            {/* Core Features */}
            <section className="about-grid">
                <div className="about-card">
                    <h3>🔍 Smart Search</h3>
                    <p>Instantly find schemes across categories like Education, Farming, and Housing.</p>
                </div>
                <div className="about-card">
                    <h3>🌐 Multilingual Support</h3>
                    <p>Accessible in English, Hindi, and Gujarati to ensure every citizen is reached.</p>
                </div>
                <div className="about-card">
                    <h3>🛡️ Secure Portal</h3>
                    <p>Personalized dashboards for citizens to save and track their eligibility status.</p>
                </div>
            </section>

            {/* Tech Stack for ADIT Presentation */}
            <section className="tech-section">
                <h2>Technical Architecture</h2>
                <div className="tech-stack">
                    {techStack.map((tech, index) => (
                        <div key={index} className="tech-pill">
                            <span>{tech.icon}</span>
                            <strong>{tech.name}</strong>
                            <small>{tech.desc}</small>
                        </div>
                    ))}
                </div>
            </section>

            <footer className="about-footer">
                <p>Developed as a Mini Project at <strong>A D Patel Institute of Technology</strong></p>
            </footer>
        </div>
    );
};

export default About;