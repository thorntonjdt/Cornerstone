import React, { Component, Children, cloneElement } from 'react';

import styles from './Loop.css';

class Loop extends Component {
  constructor(){
    super();
    this.state = {
      currentIndex: 0
    }
    this.showNext = this.showNext.bind(this);
  }
  componentDidMount(){
    setTimeout(this.showNext, this.props.interval);
  }
  showNext(){
    const { children, interval } = this.props;
    const { currentIndex } = this.state;
    if((currentIndex + 1) < children.length){
      setTimeout(this.showNext, interval)
      this.setState({
        currentIndex: this.state.currentIndex + 1
      })
    }
  }
  render() {
    const { currentIndex } = this.state;
    const { children } = this.props;
    return (
      <span>
        {Children.map(
          children,
          (child, i) =>
            i === currentIndex && cloneElement(child, { className: styles.text }),
        )}
      </span>
    )
  }
}

export default Loop;
