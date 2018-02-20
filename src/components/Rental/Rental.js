import React from 'react';

import Card from 'components/Card/Card.js';
import Image from 'components/Image/Image.js';

import styles from './Rental.css';

const Rental = ({listing, rent}) => (
  <div className={styles.container}>
    <Card>
      <div className={styles.content}>
        <Image image={listing.image} height="200px" width="200px" />
        <div className={styles.details}>
          <h3>{listing.property.address}, Unit {listing.unit}</h3>
          <p>{listing.property.city}, {listing.property.state} {listing.property.zip}</p>
          <div className={styles.rooms}><h5>Rooms:</h5> {listing.bedrooms} bed / {listing.bathrooms} bath</div>
          <div><h5>Rent:</h5> ${rent}/mo.</div>
        </div>
      </div>
    </Card>
  </div>
)

export default Rental;
