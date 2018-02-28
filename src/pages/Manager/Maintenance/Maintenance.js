import React from 'react';

import Subheader from 'components/Subheader/Subheader';
import LoadList from 'components/LoadList/LoadList';
import Filter from 'components/Filter/Filter';
import Card from 'components/Card/Card';
import CardHeader from 'components/CardHeader/CardHeader';
import TicketItem from 'components/TicketItem/TicketItem';
import Circle from 'components/Circle/Circle';

import styles from './Maintenance.css';

const Maintenance = ({manager}) => (
  <LoadList url={`/m/managers/${manager}/tickets`}>
    {tickets => {

      if(tickets.length > 0)
      return(
        <div>
          <Subheader title={<h2>Tickets</h2>} />
          <Filter
            items={tickets}
            itemKeys={["lease.listing.property.address"]}
            placeholder="Find by address"
            name="Tickets"
          >
            {filteredTickets => {
              const openTickets = filteredTickets.filter(ticket =>
                ticket.open
              );
              const closedTickets = filteredTickets.filter(ticket =>
                !ticket.open
              );
              return(
                <div>
                  {openTickets.length > 0 &&
                    <Card>
                      <CardHeader color="#55B475">
                        <span className={styles.title}>Open</span>
                      </CardHeader>
                      {openTickets.map(ticket =>
                        <TicketItem key={ticket._id} ticket={ticket} app="m" />
                      )}
                    </Card>
                  }
                  {closedTickets.length > 0 &&
                    <Card>
                      <CardHeader color="#78909C">
                        <span className={styles.title}>Closed</span>
                      </CardHeader>
                      {closedTickets.map(ticket =>
                        <TicketItem key={ticket._id} ticket={ticket} app="m" />
                      )}
                    </Card>
                  }
                </div>
              )
            }}
          </Filter>
        </div>
      )

      else
      return(
        <div className={styles.noTickets}>
          <Circle>
            <svg height="36" width="36" viewBox="0 0 24 24">
              <path fill="#4a90e2" d="M22.7 19l-9.1-9.1c.9-2.3.4-5-1.5-6.9-2-2-5-2.4-7.4-1.3L9 6 6 9 1.6 4.7C.4 7.1.9 10.1 2.9 12.1c1.9 1.9 4.6 2.4 6.9 1.5l9.1 9.1c.4.4 1 .4 1.4 0l2.3-2.3c.5-.4.5-1.1.1-1.4z"></path>
            </svg>
          </Circle>
          <h1>Track maintenance requests</h1>
          <p>Communicate with your tenants about maintenance requests</p>
        </div>
      )
    }}
  </LoadList>
);

export default Maintenance;
