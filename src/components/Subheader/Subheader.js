import React from 'react';

import styles from './Subheader.css';

const Subheader = ({title, button}) => (
  <div className={styles.header}>
    {title}
    {button}
  </div>
);

export default Subheader;
