import React from 'react';
import { Link } from 'react-router-dom';

import Subheader from 'components/Subheader/Subheader.js';
import LoadList from 'components/LoadList/LoadList.js';
import Filter from 'components/Filter/Filter.js';
import LeaseItem from 'components/LeaseItem/LeaseItem.js';
import Circle from 'components/Circle/Circle.js';
import FilledButton from 'components/FilledButton/FilledButton.js';

import styles from './Payments.css';

const Payments = ({manager}) => (
  <LoadList url={`/m/managers/${manager}/lease`} >
    {leases => {

      if(leases.length > 0)
      return(
        <div>
          <Subheader title={<h2>Payments</h2>} />
          <Filter
            items={leases}
            itemKeys={["listing.property.address"]}
            placeholder="Find by address"
            name="Leases"
          >
            {filteredLeases => (
              <div>
                {filteredLeases.map(lease =>
                  <LeaseItem key={lease._id} lease={lease} address={lease.listing.property.address} />
                )}
              </div>
            )}
          </Filter>
        </div>
      )


      else
      return (
        <div className={styles.placeholder}>
          <Circle>
            <svg width="40" height="40" viewBox="0 0 32 32">
              <path fill="#40C057" d="M29 4h-9c0-2.209-1.791-4-4-4s-4 1.791-4 4h-9c-0.552 0-1 0.448-1 1v26c0 0.552 0.448 1 1 1h26c0.552 0 1-0.448 1-1v-26c0-0.552-0.448-1-1-1zM16 2c1.105 0 2 0.895 2 2s-0.895 2-2 2c-1.105 0-2-0.895-2-2s0.895-2 2-2zM28 30h-24v-24h4v3c0 0.552 0.448 1 1 1h14c0.552 0 1-0.448 1-1v-3h4v24z"></path>
              <path fill="#40C057" d="M14 26.828l-6.414-7.414 1.828-1.828 4.586 3.586 8.586-7.586 1.829 1.828z"></path>
            </svg>
          </Circle>
          <h1>Start a rental agreement</h1>
          <p>Add tenants to a lease and start receiving payments.</p>
          <Link className={styles.addBtn} to="/m/leases/new">
            <FilledButton
              width="100%"
              height="48px"
              font="14px"
            >
              Add a property
            </FilledButton>
          </Link>
        </div>
      )
    }}
  </LoadList>
);

export default Payments;
