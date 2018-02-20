import React from 'react';

import Tabs from 'components/Tabs/Tabs.js';
import Tab from 'components/Tab/Tab.js';
import InfoForm from 'components/InfoForm/InfoForm.js';
import AccountForm from 'components/AccountForm/AccountForm.js';

import styles from './Settings.css';

const Settings = ({user}) => (
  <div>
    <h2 className={styles.header}>Your Settings</h2>
    <Tabs>
      <Tab text="Personal Info">
        <div className={styles.content}>
          <InfoForm user={user} app="t" />
        </div>
      </Tab>
      <Tab text="Account">
        <div className={styles.content}>
          <AccountForm user={user} app="t" />
        </div>
      </Tab>
    </Tabs>
  </div>
)

export default Settings;
