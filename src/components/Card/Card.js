import React from 'react';

import styles from './Card.css';

const Card = ({children}) => (
  <div className={styles.container}>
    {children}
  </div>
);

export default Card;
