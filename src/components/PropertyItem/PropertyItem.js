import React from 'react';
import { Link } from 'react-router-dom';

import Image from 'components/Image/Image';
import Dropdown from 'components/Dropdown/Dropdown';

import styles from './PropertyItem.css';

const PropertyItem = ({property}) => (
  <div className={styles.card}>
    <span className={styles.right}>
      <Dropdown
        hoverStyle={styles.menuBtn}
        button="..."
        positioning={styles.position}
      >
        <ul className={styles.dropdown}>
            <li className={styles.link}><Link to={{pathname: `/m/properties/${property._id}`, state: {page: 0}}}>Leases</Link></li>
            <li className={styles.link}><Link to={{pathname: `/m/properties/${property._id}`, state: {page: 1}}}>Listings</Link></li>
            <li className={styles.link}><Link to={{pathname: `/m/properties/${property._id}`, state: {page: 2}}}>Applications</Link></li>
            <hr />
            <li className={styles.link}><Link to={`/m/properties/${property._id}/update`}>Edit Property</Link></li>
        </ul>
      </Dropdown>
    </span>
    <Link to={`/m/properties/${property._id}`}>
      <Image
        image={property.img}
        placeholder={
          <svg xmlns="http://www.w3.org/2000/svg" width="75" height="75" viewBox="0 0 24 24"><path fill="#d3d3d3" d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg>
        }
        height="175px"
        width="100%"
      />
      <div className={styles.banner}>
        <div className={styles.address}>{property.address}</div>
        <div className={styles.city}>{property.city}, {property.state} {property.zip}</div>
      </div>
    </Link>
  </div>
);

export default PropertyItem;
