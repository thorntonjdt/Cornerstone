import React from 'react';
import { Link } from 'react-router-dom';

import Image from 'components/Image/Image.js';

import styles from './ListingItem.css';

const ListingItem = ({listing, location}) => (
  <div className={styles.container}>
    <div className={styles.details}>
      <Image
        image={listing.image}
        width="60px"
        height="60px"
      />
      <div className={styles.info}>
        <Link to={`/listings/${listing._id}`}><h5 className={styles.hover}>{location}</h5></Link>
        <p>${listing.rent}/mo • {listing.bedrooms} Bed • {listing.bathrooms} Bath</p>
      </div>
    </div>
    <div>
      <Link to={`/m/listings/${listing._id}/update`}>
        <span className={styles.actions}>Edit Listing</span>
      </Link>
      <Link to={`/listings/${listing._id}`}>
        <span className={styles.actions}>Preview</span>
      </Link>
    </div>
  </div>
)

export default ListingItem;
