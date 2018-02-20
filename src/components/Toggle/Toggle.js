import React from 'react';

import styles from './Toggle.css';

const Toggle = ({isToggled, handleToggle}) => (
  <label className={styles.switch}>
    <input type="checkbox" checked={isToggled} onChange={() => {handleToggle();}} className={styles.toggle} />
    <div className={styles.slider}></div>
  </label>
);

export default Toggle;
