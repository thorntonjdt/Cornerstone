import React from 'react';
import { Link } from 'react-router-dom';

import Image from 'components/Image/Image.js';

import styles from './ListingCard.css';

const ListingCard = ({listing}) => (
  <Link to={`/listings/${listing._id}`} className={styles.container}>
    <Image
      image={listing.image}
      width="100%"
      height="100%"
    />
    <div className={styles.details}>${listing.rent} • {listing.bedrooms} BED • {listing.bathrooms} BATH</div>
    <div className={styles.headline}>{listing.headline}</div>
    <div className={styles.address}>{listing.property.address}, {listing.property.city}, {listing.property.state}</div>
  </Link>
);

export default ListingCard;
