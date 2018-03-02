import React from 'react';

import styles from './Image.css';

const Image = ({image, height, width, placeholder}) => {
  if(image){
    return (
      <div className={styles.image} style={{width: `${width}`, height: `${height}`, backgroundImage: `url(${image})`}}></div>
    );
  }
  return (
    <div className={styles.placeholder} style={{width: `${width}`, height: `${height}`}}>
      {placeholder}
    </div>
  )
}


);

export default Image;
