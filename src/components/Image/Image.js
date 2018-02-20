import React from 'react';

import styles from './Image.css';

const Image = ({image, height, width}) => (
  <div className={styles.image} style={{width: `${width}`, height: `${height}`, backgroundImage: `url(${image})`}}></div>
);

export default Image;
