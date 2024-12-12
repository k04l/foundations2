// src/components/Logo.jsx
import React from 'react';
import styles from './Logo.module.css';

export const Logo = ({ className = '', size = 'md' }) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-24 h-24'
  };

  return (
    <div className={`${styles['logo-container']} ${sizeClasses[size]} ${className}`}>
      <div className={styles['logo-glow']} />
      <img 
        src="/bernoullia-logo.svg" 
        alt="Bernoullia" 
        className={`${styles.logo} ${className}`}
      />
    </div>
  );
};

export default Logo;