import React from 'react';

import styles from './Dropdown.css';

class Dropdown extends React.Component {
  constructor() {
    super();

    this.handleOpen = this.handleOpen.bind(this);
    this.handleClose = this.handleClose.bind(this);

    this.state = {
      popupVisible: false
    };
  }

  handleOpen() {
    this.setState({popupVisible: true});
  }

  handleClose() {
    this.setState({popupVisible: false})
  }

  render() {
    let { popupVisible } = this.state;
    let { button, children, positioning } = this.props;
    let className = `${styles.dropdown} ${positioning}`;
    if(popupVisible){
      className += ` ${styles.open}`
    }
    return (
      <span className={this.props.hoverStyle} onMouseEnter={this.handleOpen} onMouseLeave={this.handleClose}>
        {button}
        <div onClick={this.handleClose} className={className}>
          {children}
        </div>
      </span>
    );
  }
}

export default Dropdown;
