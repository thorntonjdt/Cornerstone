import React from 'react';
import { Link } from 'react-router-dom'

import formatDate from 'utils/DateFormatter/DateFormatter.js';

import styles from './ApplicationItem.css';

const ApplicationItem = ({application, location, toggleArchive}) => {
  const handleToggleArchive = (e) => {
    e.preventDefault();
    toggleArchive(application._id, application.archived);
  }
  var formattedDate = formatDate(application.createdAt);
  var label = application.applicant.first_name.charAt(0) + application.applicant.last_name.charAt(0)
  var archiveBtn = application.archived ? 'Unarchive' : 'Archive';
  return (
    <div className={styles.container}>
      <Link className={styles.wrap} to={`/m/applications/${application._id}`}>
        <span className={styles.avatar}>
          {label}
        </span>
        <div className={styles.row}>
          <span>
            <h5>{application.applicant.first_name} {application.applicant.last_name}</h5>
            <span className={styles.faded}>Applied {formattedDate}</span>
          </span>
          <span className={styles.faded} style={{margin: '10px 0'}}>{location}</span>
          <span className={styles.link} onClick={handleToggleArchive}>{archiveBtn}</span>
        </div>
      </Link>
    </div>
  )
}

export default ApplicationItem;
