import React from 'react';

import styles from './BorderButton.css';

const BorderButton = ({children, width, height, font, onClick}) => (
  <div style={{width: `${width}`, height: `${height}`, fontSize: `${font}`}} onClick={onClick} className={styles.container}>
    {children}
  </div>
);

export default BorderButton;
