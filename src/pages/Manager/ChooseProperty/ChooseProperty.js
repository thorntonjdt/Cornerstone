import React from 'react';
import { Link } from 'react-router-dom';

import APIManager from 'utils/APIManager.js';
import Subheader from 'components/Subheader/Subheader.js';
import Card from 'components/Card/Card.js';
import FilledButton from 'components/FilledButton/FilledButton.js';
import LoadSpinner from 'components/LoadSpinner/LoadSpinner.js';

import styles from './ChooseProperty.css'

class ChooseProperty extends React.Component {
  constructor(){
    super();
    this.state = {
      properties: [],
      choice: null,
      error: '',
      loading: true
    }
    this.chooseProperty = this.chooseProperty.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
  }
  componentDidMount(){
    APIManager.get(`/m/managers/${this.props.manager}/properties`, (err, response) => {
      if(err){
        console.log(err);
        return;
      }
      this.setState({properties: response, loading: false})
    })
  }
  chooseProperty(){
    if(!this.state.choice){
      this.setState({error: true})
    } else {
      this.props.history.push({pathname: '/m/listings/new', state: {propertyId: this.state.choice}})
    }
  }
  handleInputChange(event){
    const target = event.target;
    const value = target.value;
    const name = target.name;

    this.setState({
      [name]: value
    });
  }
  render(){
    const { properties, choice, error, loading } = this.state;
    if(!loading)
    return(
      <div>
        <Subheader title={<h2>New Listing</h2>} />
        <div className={styles.container}>
          <Card>
            <div className={styles.padding}>
              <h3>Which property is this listing for?</h3>
              <label for="choice">Choose a property</label>
              <select style={error ? {borderColor: '#e75b52'} : {}} value={choice} name="choice" onChange={this.handleInputChange}>
                <option disabled selected value="">Select...</option>
                {properties.map(property =>
                  <option value={property._id}>{property.address}</option>
                )}
              </select>
              {error && <div className={styles.error}>You must choose a property</div>}
              <div className={styles.create}>Or, <Link to='/m/properties/new' className={styles.link}>create a new property</Link></div>
            </div>
          </Card>
          <div className={styles.choose}>
            <FilledButton
              height="35px"
              width="100%"
              font="13px"
              onClick={this.chooseProperty}
            >
              Continue
            </FilledButton>
          </div>
        </div>
      </div>
    )

    else
    return(
      <LoadSpinner />
    )
  }
}

export default ChooseProperty;
