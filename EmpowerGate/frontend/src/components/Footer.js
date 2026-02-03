import React from 'react';

const Footer = () => {
  return (
    <footer style={styles.footer}>
      <p>&copy; 2026 EmpowerGate. All Rights Reserved.</p>
      <p>Developed for Final Year Project.</p>
    </footer>
  );
};

const styles = {
  footer: {
    textAlign: 'center',
    padding: '20px',
    backgroundColor: '#2c3e50',
    color: 'white',
    marginTop: '40px'
  }
};

export default Footer;