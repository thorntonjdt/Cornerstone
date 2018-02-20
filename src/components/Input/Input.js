import React from 'react';

import styles from './Input.css';

const Input = ({name, label, value, hasError, errorText, placeholder, onChange, password}) => (
  <div className={styles.container}>
    <label for={name}>{label}</label>
    <input style={hasError ? {borderColor: '#e75b52'} : {}} type={password ? "password" : "text"} name={name} value={value} placeholder={placeholder} onChange={onChange} />
    {hasError && <div className={styles.error}>{errorText ? errorText : "This field is required."}</div>}
  </div>
)

export default Input;
