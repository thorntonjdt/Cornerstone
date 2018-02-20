import React from 'react';

import styles from './CardHeader.css';

const CardHeader = ({children, color}) => (
  <div className={styles.container} style={{backgroundColor: color}}>
    {children}
  </div>
);

export default CardHeader;
