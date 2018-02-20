import React from 'react';
import { Link } from 'react-router-dom';

import formatDate from 'utils/DateFormatter/DateFormatter.js';
import LoadList from 'components/LoadList/LoadList.js';
import Tabs from 'components/Tabs/Tabs.js';
import Tab from 'components/Tab/Tab.js';
import Transactions from 'components/Transactions/Transactions.js';
import Rental from 'components/Rental/Rental.js';

import styles from './LeaseDetails.css';

const LeaseDetails = ({match, location}) => (
  <LoadList url={`/m/leases/${match.params.id}`}>
    {lease => {
      var dateSpan = formatDate(lease.begins);
      if(lease.ends){
        dateSpan += " - "+formatDate(lease.ends);
      }
      return(
        <div>
          <div className={styles.header}>
            <div className={styles.nav}><Link to="/m/payments" className={styles.link}>payments</Link> / {lease.listing.property.address}, Unit {lease.listing.unit}</div>
            <h2>{dateSpan}</h2>
          </div>
          <Tabs active={location.state.page}>
            <Tab text="Transactions">
              <div className={styles.pagePadding}>
                <Transactions lease={lease._id} balance={lease.balance} rent={lease.rent} tenant={lease.tenant} transactions={lease.transactions} />
              </div>
            </Tab>
            <Tab text="Rental Details">
              <Rental rent={lease.rent} listing={lease.listing} />
            </Tab>
          </Tabs>
        </div>
      )
    }}
  </LoadList>
)

export default LeaseDetails;
