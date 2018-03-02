import React from 'react';
import { Link } from 'react-router-dom';

import Image from 'components/Image/Image';

import styles from './ListingCard.css';

const ListingCard = ({listing}) => (
  <Link to={`/listings/${listing._id}`} className={styles.container}>
    <Image
      image={listing.image}
      placeholder={
        <svg xmlns="http://www.w3.org/2000/svg" width="78" height="78" viewBox="0 0 24 24"><path fill="#d3d3d3" d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg>
      }
      width="100%"
      height="220px"
    />
    <div className={styles.details}>${listing.rent} • {listing.bedrooms} BED • {listing.bathrooms} BATH</div>
    <div className={styles.headline}>{listing.headline}</div>
    <div className={styles.address}>{listing.property.address}, {listing.property.city}, {listing.property.state}</div>
  </Link>
);

export default ListingCard;
