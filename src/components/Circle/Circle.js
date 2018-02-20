import React from 'react';

import styles from './Circle.css'

const Circle = ({children}) => (
  <div className={styles.border}>
    {children}
  </div>
);

export default Circle;
