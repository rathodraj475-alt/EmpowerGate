import React from 'react';

const About = () => {
  return (
    <div className="container" style={{ marginTop: '30px' }}>
      <div className="form-card">
        <h2>About EmpowerGate</h2>
        <p>
          EmpowerGate is an advanced <strong>Government Scheme Eligibility Checker</strong> designed 
          to help citizens find schemes they qualify for.
        </p>
        
        <h3>Why we built this?</h3>
        <p>
          Many people in rural India are unaware of government benefits like 
          <em>PM Kisan, Scholarships, and Pension schemes</em>. 
          EmpowerGate solves this by using a smart algorithm to match users 
          with schemes based on their Age, Income, and Caste.
        </p>

        <h3>Tech Stack</h3>
        <ul>
          <li><strong>Frontend:</strong> React.js</li>
          <li><strong>Backend:</strong> Node.js & Express</li>
          <li><strong>Database:</strong> MongoDB</li>
        </ul>
      </div>
    </div>
  );
};

export default About;