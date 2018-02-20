import React, { Component } from 'react'

import LogoSpinner from 'components/LogoSpinner/LogoSpinner.js';

class AsyncRoute extends Component {
  constructor(){
    super();
    this.state = {
      loaded: false
    }
  }

  componentDidMount(){
    this.props.loading.then(module => {
      this.component = module.default;
      this.setState({
        loaded: true
      });
    })
  }

  render(){
    let { props } = this;
    if(this.state.loaded) {
      return <this.component {...props} />;
    } else {
      return (
        <LogoSpinner />
      );
    }
  }
}

export default AsyncRoute;
