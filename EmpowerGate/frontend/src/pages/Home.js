import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable'; // 🟢 FIXED: Import as a function to solve autoTable error
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import '../App.css'; 

const Home = () => {
  const { t, i18n } = useTranslation();
  const location = useLocation(); 
  const navigate = useNavigate(); 
  
  const [formData, setFormData] = useState({
    age: '', income: '', gender: 'Any', caste: '', state: '', occupation: '' 
  });
  const [schemes, setSchemes] = useState([]);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showStats, setShowStats] = useState(false);

  const [realCounts, setRealCounts] = useState({
    total: 0,
    Farmers: 0, Students: 0, Women: 0, Business: 0, 
    Unemployed: 0, Health: 0, Housing: 0, Banking: 0, Citizens: 0
  });

  useEffect(() => {
    const fetchAndCount = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/schemes');
        const data = res.data;

        setRealCounts((prevCounts) => {
          const newCounts = { ...prevCounts, total: data.length };
          data.forEach(s => {
            if (newCounts[s.category] !== undefined) {
              newCounts[s.category]++;
            } else {
              newCounts.Citizens++;
            }
          });
          return newCounts;
        });

        const params = new URLSearchParams(location.search);
        const query = params.get('search');
        if (query) {
          setLoading(true);
          const q = query.toLowerCase().trim();
          const filtered = data.filter(s => {
            const nameEn = s.name.en?.toLowerCase() || "";
            const nameHi = s.name.hi?.toLowerCase() || "";
            return nameEn.includes(q) || nameHi.includes(q);
          });
          setSchemes(filtered);
          setSearched(true);
          setLoading(false);
        }
      } catch (err) {
        console.error("Error fetching counts:", err);
      }
    };
    fetchAndCount();
  }, [location.search]);

  const categories = [
    { name: "Agriculture", icon: "🌾", backendCategory: "Farmers" },
    { name: "Education", icon: "🎓", backendCategory: "Students" },
    { name: "Women & Child", icon: "👩‍👧", backendCategory: "Women" },
    { name: "Business", icon: "💼", backendCategory: "Business" },
    { name: "Skills & Jobs", icon: "🛠", backendCategory: "Unemployed" },
    { name: "Health", icon: "🏥", backendCategory: "Health" },
    { name: "Housing", icon: "🏠", backendCategory: "Housing" },
    { name: "Banking", icon: "🏦", backendCategory: "Banking" },
  ];

  const handleCategoryClick = (category) => {
    navigate(`/search?category=${encodeURIComponent(category)}`);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 🟢 FIXED PDF GENERATION
  const generatePDF = () => {
    const doc = new jsPDF();
    
    // Header setup with translation lookup
    doc.setFontSize(18); 
    doc.text(t('app_name') || "EmpowerGate Report", 14, 22);
    
    doc.setFontSize(12); 
    doc.text(`${t('results_found') || "Results Found"}: ${schemes.length}`, 14, 32);

    const tableData = schemes.map((scheme, index) => {
        // 🛠️ FIX: Extract actual strings from objects based on current language
        const name = (scheme.name && typeof scheme.name === 'object') 
            ? (scheme.name[i18n.language] || scheme.name.en || "Unknown") 
            : (scheme.name || "Unknown");

        const benefits = (scheme.benefits && typeof scheme.benefits === 'object') 
            ? (scheme.benefits[i18n.language] || scheme.benefits.en || "-") 
            : (scheme.benefits || "-");

        return [index + 1, name, scheme.ministry, benefits];
    });

    // 🟢 FIXED: Calling the imported autoTable function directly on the doc instance
    autoTable(doc, { 
        startY: 40, 
        head: [[
          '#', 
          t('pdf_scheme_name') || 'Scheme Name', 
          t('pdf_ministry') || 'Ministry', 
          t('pdf_benefits') || 'Benefits'
        ]], 
        body: tableData,
        headStyles: { fillColor: [34, 197, 94] }, // Matches your green portal theme
        styles: { font: "helvetica", fontSize: 10 }
    });

    doc.save('EmpowerGate_Report.pdf');
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); setLoading(true); setSearched(false); setShowStats(false);
    if (location.search) navigate('/');

    try {
      const res = await axios.post('http://localhost:5000/api/check-eligibility', {
        age: Number(formData.age), 
        income: Number(formData.income), 
        gender: formData.gender, 
        caste: formData.caste, 
        state: formData.state, 
        occupation: formData.occupation 
      });
      setSchemes(res.data); setSearched(true);
      localStorage.setItem('empowerGateData', JSON.stringify({ schemes: res.data, searched: true, formData: formData }));
    } catch (error) { 
      console.error("Error", error); 
      alert("Server Error. Is Backend running?"); 
    }
    setLoading(false);
  };

  const clearResults = () => {
    localStorage.removeItem('empowerGateData'); setSchemes([]); setSearched(false); setShowStats(false);
    setFormData({ age: '', income: '', gender: 'Any', caste: '', state: '', occupation: '' });
    navigate('/'); 
  };

  const getChartData = () => {
    const centralCount = schemes.filter(s => s.state === 'All India').length;
    const stateCount = schemes.filter(s => s.state !== 'All India').length;
    return [{ name: 'Central Govt', value: centralCount }, { name: 'State Govt', value: stateCount }];
  };
  const COLORS = ['#0088FE', '#00C49F'];

  const getSchemeName = (s) => (s.name && typeof s.name === 'object') ? (s.name[i18n.language] || s.name['en']) : s.name;
  const getSchemeDesc = (s) => (s.description && typeof s.description === 'object') ? (s.description[i18n.language] || s.description['en']) : (s.description || "No description.");
  const getSchemeBenefits = (s) => (s.benefits && typeof s.benefits === 'object') ? (s.benefits[i18n.language] || s.benefits['en']) : (s.benefits || "-");

  return (
    <div>
      <div className="hero-section">
        <div className="hero-content">
          <h1>{t('home_title')}</h1>
          <p>{t('home_subtitle')}</p>
        </div>

        <div className="hero-form-container">
           <div style={{display:'flex', justifyContent:'space-between', marginBottom:'20px', color:'var(--text-color)'}}>
               <h2 style={{margin:0}}>🔎 Find Your Schemes</h2>
               {searched && <button onClick={clearResults} style={{background:'var(--secondary-color)', color:'white', border:'none', padding:'5px 15px', borderRadius:'20px', cursor:'pointer'}}>🔄 Reset Search</button>}
            </div>
          <form onSubmit={handleSubmit} className="search-form">
            <div className="form-group"><label>Age</label><input type="number" name="age" value={formData.age} required onChange={handleChange} placeholder="e.g. 25" /></div>
            <div className="form-group"><label>Annual Family Income (₹)</label><input type="number" name="income" value={formData.income} required onChange={handleChange} placeholder="Annual Income (₹)" /></div>
            
            <div className="form-group">
              <label>Gender</label>
              <select name="gender" value={formData.gender} onChange={handleChange}>
                <option value="Any">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>

            <div className="form-group">
              <label>Category (Caste)</label>
              <select name="caste" value={formData.caste} required onChange={handleChange}>
                <option value="">Select Category</option>
                <option value="General">General</option>
                <option value="OBC">OBC</option>
                <option value="SC">SC</option>
                <option value="ST">ST</option>
              </select>
            </div>

            <div className="form-group">
              <label>State</label>
              <select name="state" value={formData.state} required onChange={handleChange}>
                <option value="">Select State</option>
                <option value="Gujarat">Gujarat</option>
                <option value="Maharashtra">Maharashtra</option>
                <option value="All India">All India</option>
              </select>
            </div>

            <div className="form-group">
              <label>Occupation</label>
              <select name="occupation" value={formData.occupation} required onChange={handleChange}>
                <option value="">Select Occupation</option>
                <option value="Students">Student</option>
                <option value="Farmers">Farmer</option>
                <option value="Business">Business</option>
                <option value="Unemployed">Unemployed</option>
              </select>
            </div>

            <button type="submit" className="btn-search">{loading ? "Loading..." : '🚀 Check Eligibility'}</button>
          </form>
        </div>
      </div>

      {!searched && (
        <section className="how-it-works-section">
          <p className="how-sub-title">How it works</p>
          <h2 className="how-main-title">Easy steps to apply for<br/>Government Schemes</h2>
          <div className="steps-wrapper">
            <div className="step-card">
              <div className="step-icon">📋</div>
              <h3 className="step-title">Enter Details</h3>
              <p className="step-desc">Start by entering your basic details like Age, State, and Caste to match relevant schemes.</p>
            </div>
            <div className="step-arrow">›</div>
            <div className="step-card">
              <div className="step-icon">🔎</div>
              <h3 className="step-title">Search</h3>
              <p className="step-desc">Our search engine will find the relevant schemes based on your eligibility criteria.</p>
            </div>
            <div className="step-arrow">›</div>
            <div className="step-card">
              <div className="step-icon">👆</div>
              <h3 className="step-title">Select & Apply</h3>
              <p className="step-desc">Select the best suited scheme, view details, and click the link to apply online.</p>
            </div>
          </div>
        </section>
      )}

      {!searched && (
        <section className="category-section">
          <h2 className="category-title">Find schemes based on categories</h2>
          <div className="category-grid">
            {categories.map((cat, index) => (
              <div key={index} className="category-item" onClick={() => handleCategoryClick(cat.backendCategory)}>
                <div className="cat-icon">{cat.icon}</div>
                <div className="cat-name">{cat.name}</div>
                <div className="cat-count">
                    {realCounts[cat.backendCategory] > 0 
                      ? realCounts[cat.backendCategory] 
                      : 0
                    } Schemes
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {!searched && (
        <div className="stats-banner" style={{marginTop:'40px'}}>
          <div className="stat-item">
            <h2>{realCounts.total}</h2>
            <p>Total Schemes</p>
          </div>
          <div className="stat-item" style={{borderLeft:'2px solid var(--text-color)', borderRight:'2px solid var(--text-color)', padding:'0 50px'}}>
              <h2>Central & State</h2><p>Government Benefits</p>
          </div>
          <div className="stat-item"><h2>8+</h2><p>Categories Covered</p></div>
        </div>
      )}

      <div className="container">
        {searched && (
          <div className="results-section" style={{marginTop:'40px'}}>
             <div className="results-header">
              <h2 style={{margin:0}}>
                {schemes.length > 0 ? "Results Found" : "No Results"} 
                <span style={{fontSize:'0.8em', opacity:0.7}}> ({schemes.length} results)</span>
              </h2>
              {schemes.length > 0 && (
                <div style={{display:'flex', gap:'10px'}}>
                   <button onClick={() => setShowStats(!showStats)} style={{ backgroundColor: 'var(--secondary-color)', color: 'white', border: 'none', padding: '10px 15px', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}>{showStats ? '❌ Hide Stats' : '📊 View Analytics'}</button>
                   <button onClick={generatePDF} style={{ backgroundColor: '#dc3545', color: 'white', border: 'none', padding: '10px 15px', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}>📥 PDF</button>
                </div>
              )}
            </div>

            {showStats && schemes.length > 0 && (
              <div style={{background: 'var(--card-bg)', padding: '20px', borderRadius: '12px', marginBottom: '30px', boxShadow: 'var(--shadow)', textAlign: 'center'}}>
                <div style={{ width: '100%', height: 300 }}>
                  <ResponsiveContainer>
                    <PieChart>
                      <Pie data={getChartData()} cx="50%" cy="50%" outerRadius={80} fill="#8884d8" dataKey="value" label>{getChartData().map((entry, index) => (<Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />))}</Pie>
                      <Tooltip contentStyle={{backgroundColor:'var(--card-bg)', borderRadius:'8px'}}/>
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}
            
            <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(350px, 1fr))', gap:'20px'}}>
                {schemes.map((scheme, idx) => {
                const schemeName = getSchemeName(scheme);
                const schemeDesc = getSchemeDesc(scheme);
                const schemeBenefits = getSchemeBenefits(scheme);
                const shareText = `Check out this scheme: ${schemeName}. Apply: ${scheme.link}`;
                const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(shareText)}`;

                return (
                  <div key={idx} className="scheme-card">
                    <h3>{schemeName}</h3>
                    <p>{schemeDesc}</p>
                    <div style={{margin:'15px 0'}}>
                      <span className="tag">🏛 {scheme.ministry}</span>
                      <span className="tag">📍 {scheme.state}</span>
                      <span className="tag">👤 {scheme.category}</span>
                    </div>
                    <p><strong>Benefits:</strong> {schemeBenefits}</p>
                    <div style={{marginTop: '20px', display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                      <a href={scheme.link} target="_blank" rel="noopener noreferrer" className="btn-link">Apply Now →</a>
                      <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="btn-whatsapp">📱 Share</a>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;