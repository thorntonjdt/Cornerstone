import React from 'react';
import { Link } from 'react-router-dom';

import Dropdown from 'components/Dropdown/Dropdown.js';

import styles from './AccountButton.css';

const AccountButton = ({user, logout, location}) => {
  const app = user.manager ? "m" : "t";
  var onHover = styles.link;
  if(location[1] == 'm' || location[1] == 't'){
    onHover += ' '+styles.background;
  } else {
    onHover += ' '+styles.border;
  }
  return(
    <Dropdown
      hoverStyle={onHover}
      positioning={styles.accountPosition}
      button={
        <svg className={styles.accountBtn} height="28" width="28" viewBox="0 0 24 24">
          <path fill="#AAB1AE" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"></path>
        </svg>
      }
    >
      <ul className={styles.accountDropdown}>
        {app == 'm' &&
          <li className={styles.dropdownLink}><Link to={`/m/properties`}>Properties</Link></li>
        }
        {(app == 'm' || app == 't') &&
          <li className={styles.dropdownLink}><Link to={`/${app}/payments`}>Payments</Link></li>
        }
        <li className={styles.dropdownLink}><Link to={`/${app}/settings`}>Settings</Link></li>
        <li className={styles.dropdownLink} onClick={logout}>Sign Out</li>
      </ul>
    </Dropdown>
  );
}

export default AccountButton;
