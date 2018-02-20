import React from 'react';

import styles from './Tabs.css';

class Tabs extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      activeTabIndex: props.active || 0
    };
    this.handleTabClick = this.handleTabClick.bind(this);
  }
  handleTabClick(tabIndex) {
    this.setState({
      activeTabIndex: tabIndex === this.state.activeTabIndex ? this.props.defaultActiveTabIndex : tabIndex
    });
  }

  renderChildrenWithTabsApiAsProps() {
    return React.Children.map(this.props.children, (child, index) => {
      return React.cloneElement(child, {
        onClick : this.handleTabClick,
        tabIndex: index,
        isActive: index === this.state.activeTabIndex
      });
    });
  }

  renderActiveTabContent() {
    const {children} = this.props;
    const {activeTabIndex} = this.state;
    if(children[activeTabIndex]) {
      return children[activeTabIndex].props.children;
    }
  }

  render() {
    return (
      <div>
        <ul className={styles.nav}>
          {this.renderChildrenWithTabsApiAsProps()}
        </ul>
        <div>
          {this.renderActiveTabContent()}
        </div>
      </div>
    );
  }
};

export default Tabs;
