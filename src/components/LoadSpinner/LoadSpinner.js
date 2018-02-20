import React from 'react';

import styles from './LoadSpinner.css';

const LoadSpinner = () => (
  <div className={styles.container}>
    <svg width="55" height="55" viewBox="0 0 32 32" fill="#d3d3d3">
      <path opacity="0.25" d="M16 0a16 16 0 0 0 0 32 16 16 0 0 0 0-32m0 4a12 12 0 0 1 0 24 12 12 0 0 1 0-24"></path>
      <path d="M16 0a16 16 0 0 1 16 16h-4A12 12 0 0 0 16 4z"></path>
    </svg>
  </div>
);

export default LoadSpinner;
