import React from 'react';
import { Link } from 'react-router-dom';

import formatDate from 'utils/DateFormatter/DateFormatter.js';

import styles from './NotificationItem.css';

const NotificationItem = ({notification, follow, close}) => {
  const handleFollow = () => {
    close(notification.date);
    follow(notification.link);
  }
  const handleClose = () => {
    close(notification.date)
  }
  let date = formatDate(notification.date);
  return(
    <div className={styles.container}>
      <div className={styles.row}>
        <span className={styles.faded}>{date}</span>
        <svg onClick={handleClose} className={styles.clicky} width="24" height="24" viewBox="0 0 24 24">
          <path fill="#AAB1AE" d="M13.06 12l5.72-5.72c.292-.292.292-.767 0-1.06-.294-.293-.768-.293-1.06 0L12 10.94 6.28 5.22c-.293-.293-.767-.293-1.06 0-.293.293-.293.768 0 1.06L10.94 12l-5.72 5.72c-.293.292-.293.767 0 1.06.146.146.338.22.53.22s.384-.074.53-.22L12 13.06l5.72 5.72c.145.146.337.22.53.22.19 0 .383-.074.53-.22.292-.293.292-.768 0-1.06L13.06 12z" />
        </svg>
      </div>
      <div className={styles.clicky} onClick={handleFollow}>
        <p>{notification.content}</p>
        <div className={styles.link}>{notification.label}</div>
      </div>
    </div>
  );
}

export default NotificationItem;
