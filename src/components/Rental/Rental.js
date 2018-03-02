import React from 'react';

import Card from 'components/Card/Card';
import Image from 'components/Image/Image';

import styles from './Rental.css';

const Rental = ({listing, rent}) => (
  <div className={styles.container}>
    <Card>
      <div className={styles.content}>
        <Image
          image={listing.image}
          placeholder={
            <svg xmlns="http://www.w3.org/2000/svg" width="68" height="68" viewBox="0 0 24 24"><path fill="#d3d3d3" d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg>
          }
          height="200px"
          width="200px"
        />
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
