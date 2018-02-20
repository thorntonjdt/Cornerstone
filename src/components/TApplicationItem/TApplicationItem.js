import React from 'react';
import { Link } from 'react-router-dom';

import formatDate from 'utils/DateFormatter/DateFormatter.js';

import styles from './TApplicationItem.css';

const TApplicationItem = ({application}) => {
  let submitted = formatDate(application.createdAt);
  return(
    <div className={styles.container}>
      <div>
        <span className={styles.bubble}>APPLICATION SENT</span>
        <span>{submitted}</span>
      </div>
      <p>You sent an application for <Link className={styles.link} to={`/listings/${application.listing._id}`}>{application.listing.property.address}, Unit {application.listing.unit}</Link></p>
    </div>
  );
}

export default TApplicationItem;
