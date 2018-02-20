import React from 'react';
import { Link } from 'react-router-dom';

import FilledButton from 'components/FilledButton/FilledButton.js';
import Loop from 'components/Loop/Loop.js';

import styles from './Landing.css';

class Landing extends React.Component {
  constructor(){
    super();
    this.state = {
      value: ''
    }
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
  }
  handleSubmit(e){
    e.preventDefault();
    this.props.history.push({pathname: '/listings', state: { search: this.state.value }});
  }
  handleInputChange(e){
    this.setState({
      value: e.target.value
    });
  }
  render(){
    return(
      <div className={styles.container}>
        <div className={styles.headline}>
          <Loop interval={1600}>
            <span>Manage</span>
            <span>Apply</span>
            <span>Search</span>
          </Loop>
          <div style={{marginTop: -10, marginBottom: 15}}>Property Rentals</div>
        </div>
        <form onSubmit={this.handleSubmit}>
          <input type="text" value={this.state.value} onChange={this.handleInputChange} className={styles.search} placeholder="Enter a city, address or ZIP code" />
          <FilledButton height="50px" width="102px" font="14px" onClick={this.handleSubmit}>
            Search
          </FilledButton>
        </form>
      </div>
    );
  }
}

export default Landing;
