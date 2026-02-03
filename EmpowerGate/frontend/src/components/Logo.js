import React from 'react';

const Logo = ({ className }) => {
  return (
    <svg 
      width="40" 
      height="40" 
      viewBox="0 0 40 40" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path d="M4 36H36" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
      <path d="M8 36V16C8 10.4772 12.4772 6 18 6H22C27.5228 6 32 10.4772 32 16V36" stroke="currentColor" strokeWidth="3"/>
      <path d="M20 24V12M20 12L15 17M20 12L25 17" stroke="var(--secondary-color)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
};

export default Logo;