import React from 'react';

import styles from './Dropdown.css';

class Dropdown extends React.Component {
  constructor() {
    super();
    this.state = {
      popupVisible: false
    };
    this.handleOpen = this.handleOpen.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleOutsideClick = this.handleOutsideClick.bind(this);
  }

  handleOpen() {
    document.addEventListener('click', this.handleOutsideClick, false);
    this.setState({popupVisible: true});
  }

  handleClose(e) {
    e.stopPropagation();
    document.removeEventListener('click', this.handleOutsideClick, false);
    this.setState({popupVisible: false});
  }
  handleOutsideClick(e) {
    if (this.node.contains(e.target)) {
      return;
    }

    this.handleClose(e);
  }
  render() {
    let { popupVisible } = this.state;
    let { button, children, positioning } = this.props;
    let className = `${styles.dropdown} ${positioning}`;
    if(popupVisible){
      className += ` ${styles.open}`
    }
    return (
      <span className={this.props.hoverStyle} onClick={this.handleOpen} onMouseEnter={this.handleOpen} onMouseLeave={this.handleClose}  ref={node => {this.node = node; }}>
        {button}
        <div onClick={this.handleClose} className={className}>
          {children}
        </div>
      </span>
    );
  }
}

export default Dropdown;
