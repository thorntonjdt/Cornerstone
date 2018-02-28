import React from 'react';

import AccountButton from 'components/AccountButton/AccountButton';
import Notifications from 'components/Notifications/Notifications';
import AuthModal from 'components/AuthModal/AuthModal';

import styles from './AuthComponent.css';

const AuthComponent = ({user, login, logout, history, location}) => {
  var align = styles.align;
  if(location[1] == 'm' || location[1] == 't'){
    align += ' '+styles.margin;
  }
  if(user)
  return(
    <div className={align}>
      <AccountButton user={user} logout={logout} location={location} />
      <Notifications user={user} history={history} location={location} />
    </div>
  )

  else
  return(
    <AuthModal login={login}>
      {(openLoginModal, openSignUpModal) =>
        <span className={styles.buttons}>
          <span onClick={openSignUpModal}>Sign Up</span>
          <span onClick={openLoginModal}>Log In</span>
        </span>
      }
    </AuthModal>
  )
}

export default AuthComponent;
