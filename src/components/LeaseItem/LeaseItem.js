import React from 'react';
import { Link } from 'react-router-dom';

import formatDate from 'utils/DateFormatter/DateFormatter.js';
import Card from 'components/Card/Card.js';

import styles from './LeaseItem.css';

const LeaseItem = ({lease, address}) => {
  const begins = formatDate(lease.begins);
  const ends = lease.ends ? " - "+formatDate(lease.ends) : null;
  return(
    <div className={styles.space}>
      <Card>
        <div className={styles.header}>
          <h5>{address && address+", "}Unit {lease.listing.unit}</h5>
          <div className={styles.muted}>{begins}{ends}</div>
        </div>
          <div className={styles.body}>
            <div>
              <h5>Due Today</h5>
              <div className={styles.green}>${lease.balance}.00</div>
            </div>
            <div>
              <h5>Rent</h5>
              <div className={styles.green}>${lease.rent}.00</div>
              <div className={styles.muted}>due on the 1st</div>
            </div>
            <div>
              <h5>Tenants</h5>
              <div className={styles.muted}>{lease.tenant.first_name} {lease.tenant.last_name}</div>
            </div>
          </div>
          <hr />
          <div className={styles.row}>
            <Link to={{pathname: `/m/payments/${lease._id}`, state: {page: 1}}} className={styles.link}>Rental Details</Link>
            <Link to={{pathname: `/m/payments/${lease._id}`, state: {page: 0}}} className={styles.greyBtn}>All Transactions</Link>
          </div>
      </Card>
    </div>
  );
}

export default LeaseItem;
