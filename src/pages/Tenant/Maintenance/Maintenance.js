import React from 'react';
import { Link } from 'react-router-dom';

import Subheader from 'components/Subheader/Subheader';
import LoadList from 'components/LoadList/LoadList';
import FilledButton from 'components/FilledButton/FilledButton';
import Card from 'components/Card/Card';
import CardHeader from 'components/CardHeader/CardHeader';
import TicketItem from 'components/TicketItem/TicketItem';
import Circle from 'components/Circle/Circle';

import styles from './Maintenance.css';

const Maintenance = ({tenant, lease}) => (
  <LoadList url={`/t/tenants/${tenant}/tickets`}>
    {({tickets, lease}) => {

      if(tickets.length > 0){
        const openTickets = tickets.filter(ticket =>
          ticket.open
        );
        const closedTickets = tickets.filter(ticket =>
          !ticket.open
        );
        return(
          <div>
            <Subheader
              title={<h2>Tickets</h2>}
              button={
                <Link to={{pathname: '/t/maintenance/new', state: {lease: lease}}} >
                  <FilledButton
                    width="110px"
                    height="35px"
                    font="11px"
                  >
                    New Ticket
                  </FilledButton>
                </Link>
              }
            />
            {openTickets.length > 0 &&
              <div className={styles.padding}>
                <Card>
                  <CardHeader color="#55B475">
                    <span className={styles.title}>Open</span>
                  </CardHeader>
                  {openTickets.map(ticket =>
                    <TicketItem key={ticket._id} ticket={ticket} app="t" />
                  )}
                </Card>
              </div>
            }
            {closedTickets.length > 0 &&
              <div className={styles.padding}>
                <Card>
                  <CardHeader color="#78909C">
                    <span className={styles.title}>Closed</span>
                  </CardHeader>
                  {closedTickets.map(ticket =>
                    <TicketItem key={ticket._id} ticket={ticket} app="t" />
                  )}
                </Card>
              </div>
            }
          </div>
        )
      }

      else
      return(
        <div className={styles.noTickets}>
          <Circle>
            <svg height="46" width="46" viewBox="0 0 24 24">
              <path fill="#4a90e2" d="M22.7 19l-9.1-9.1c.9-2.3.4-5-1.5-6.9-2-2-5-2.4-7.4-1.3L9 6 6 9 1.6 4.7C.4 7.1.9 10.1 2.9 12.1c1.9 1.9 4.6 2.4 6.9 1.5l9.1 9.1c.4.4 1 .4 1.4 0l2.3-2.3c.5-.4.5-1.1.1-1.4z"></path>
            </svg>
          </Circle>
          <h1>You have no maintenance requests</h1>
          <p>Submit maintenance requests and communicate with your landlord over Cornerstone.</p>
          {lease &&
            <Link to={{pathname: '/t/maintenance/new', state: {lease: lease}}} className={styles.createBtn}>
              <FilledButton
                width="100%"
                height="48px"
                font="14px"
              >
                Add a ticket
              </FilledButton>
            </Link>
          }
        </div>
      )
    }}
  </LoadList>
);

export default Maintenance;
