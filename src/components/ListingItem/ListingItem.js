import React from 'react';
import { Link } from 'react-router-dom';

import Image from 'components/Image/Image';

import styles from './ListingItem.css';

const ListingItem = ({listing, location}) => (
  <div className={styles.container}>
    <div className={styles.details}>
      <Image
        image={listing.image}
        placeholder={
          <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 24 24"><path fill="#d3d3d3" d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg>
        }
        width="60px"
        height="60px"
      />
      <div className={styles.info}>
        <Link to={`/listings/${listing._id}`}><h5 className={styles.hover}>{location}</h5></Link>
        <p>${listing.rent}/mo • {listing.bedrooms} Bed • {listing.bathrooms} Bath</p>
      </div>
    </div>
    <div className={styles.buttons}>
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
