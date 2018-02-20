import React from 'react';
import { Link } from 'react-router-dom';

import styles from './TicketItem.css';

const TicketItem = ({ticket, app}) => {
  const today = Date.now();
  const created = new Date(ticket.createdAt)
  const days = Math.round(Math.abs((created - today) / (24*60*60*1000)));
  return(
    <Link to={`/${app}/maintenance/${ticket._id}`} className={styles.container}>
        <h3>{ticket.title}</h3>
        <p>{ticket.lease.listing.property.address}, Unit {ticket.lease.listing.unit}</p>
        <div className={styles.days}><h3>{days}</h3> days ago</div>
    </Link>
  )
}

export default TicketItem;
