import React from 'react';
import get from 'lodash/get';

import APIManager from 'utils/APIManager.js';
import LoadSpinner from 'components/LoadSpinner/LoadSpinner.js';

class LoadList extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      loading: true,
      items: []
    }
  }
  componentDidMount(){
    APIManager.get(this.props.url, (err, response) => {
      if(err){
        console.log(err);
        return
      }
      this.setState({items: response, loading: false});
    });
  }
  render(){
    let { items, loading } = this.state;
    if(loading){
      return <LoadSpinner />
    } else {
      return this.props.children(items)
    }
  }
}

export default LoadList;
