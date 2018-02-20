import React from 'react';
import { Link } from 'react-router-dom';

import FilledButton from 'components/FilledButton/FilledButton.js';

import styles from './ApplicationTile.css';

const AppliationTile = ({user, applied, logout, sendApplication, manager, address, property}) => {
  let content;
  if(user.manager){
    content = (
      <div>
        <p>Sorry, landlords cannot apply to properties. Create a renter account to apply.</p>
        <div className={styles.link} onClick={logout}>Sign out of your landlord account</div>
      </div>
    );
  }
  else if(user.tenant && applied){
    content = (
      <div>
        <h4>You've already applied to this property</h4>
        <div className={styles.link}><Link to="/t/applications">Check your application status</Link></div>
      </div>
    );
  }
  else if(user.tenant){
    content = (
      <FilledButton
        width="100%"
        height="45px"
        font="13px"
        onClick={sendApplication}
      >
        Apply now
      </FilledButton>
    );
  }
  return(
    <div className={styles.container}>
      <p>Signed in as <b>{user.first_name} {user.last_name}</b></p>
        {content}
    </div>
  );
}

export default AppliationTile;
