import React from 'react';

import styles from './Tab.css';

class Tab extends React.Component {

  constructor(props, context) {
    super(props, context);
    this.handleTabClick = this.handleTabClick.bind(this);
  }

  handleTabClick(event) {
    event.preventDefault();
    this.props.onClick(this.props.tabIndex);
  }

  render() {
    return (
      <li className={styles.tab}>
        <a className={`${styles.link} ${this.props.isActive ? styles.active : ''}`}
           onClick={this.handleTabClick}>
          {this.props.text}
        </a>
      </li>
    );
  }
};

export default Tab;
