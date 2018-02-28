import React from 'react';

import Card from 'components/Card/Card';

import styles from './ImageUploader.css';

const ImageUploader = ({image, uploadImage, placeholder}) => {
  const handleFileUpload = ({target}) => {
    const image = target.files[0];
    uploadImage(image);
  }
  return(
    <Card>
      {image ?
        <div style={{backgroundImage: `url(${image})`}} className={styles.image}>

        </div>
      :
        <div className={styles.placeholder}>
          {placeholder}
        </div>
      }
      <div className={styles.banner}>
        <label className={styles.label}>
          Upload a Cover Image
          <input type="file" onChange={handleFileUpload} />
        </label>
        <span className={styles.muted}>Max file size is 30MB per image. JPG, PNG, or GIF formats only.</span>
      </div>
    </Card>
  );
}

export default ImageUploader;
