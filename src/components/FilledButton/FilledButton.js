import React from 'react';

import styles from './FilledButton.css';

const FilledButton = ({children, width, height, font, onClick}) => (
  <div style={{width: `${width}`, height: `${height}`, fontSize: `${font}`}} onClick={onClick} className={styles.container}>
    {children}
  </div>
);

export default FilledButton;
