import React from 'react';
import { Link } from 'react-router-dom';

import DatePicker from 'react-datepicker';
import moment from 'moment';
import APIManager from 'utils/APIManager.js';
import Subheader from 'components/Subheader/Subheader.js';
import BorderButton from 'components/BorderButton/BorderButton.js';
import FilledButton from 'components/FilledButton/FilledButton.js';
import ImageUploader from 'components/ImageUploader/ImageUploader.js';
import Toggle from 'components/Toggle/Toggle.js';
import LoadSpinner from 'components/LoadSpinner/LoadSpinner.js';

import styles from './ListingEditForm.css';
import 'react-datepicker/dist/react-datepicker-cssmodules.css';

class ListingEditForm extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      property: '',
      bedrooms: '',
      bathrooms: '',
      rent: '',
      deposit: '',
      unit: '',
      isActive: false,
      available: '',
      headline: '',
      description: '',
      image: null,
      loading: true
    }
    this.uploadImage = this.uploadImage.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleActiveToggle = this.handleActiveToggle.bind(this);
    this.setDateAvailable = this.setDateAvailable.bind(this);
  }
  componentDidMount(){
    APIManager.getById(`/m/listings/${this.props.match.params.id}`, (err, response) => {
      if(err){
        console.log(err);
        return;
      }
      let { bedrooms, bathrooms, headline, available, description, rent, deposit, unit, image, active, property } = response;
      this.setState({loading: false, bedrooms: bedrooms, bathrooms: bathrooms, headline: headline, description: description, available: moment(available), rent: rent, deposit: deposit, unit: unit, image: image, isActive: active, property: property})
    })
  }
  handleInputChange(event) {
    const target = event.target;
    const value = target.value;
    const name = target.name;

    this.setState({
      [name]: value
    });
  }
  uploadImage(image){
    APIManager.uploadImage(`/m/listings/${this.props.match.params.id}/picture`, image, (err) => {
      if(err){
        console.log(err);
        return;
      }
      var reader = new FileReader();
      reader.addEventListener("load", () => {
        this.setState({image: reader.result});
      }, false);
      reader.readAsDataURL(image);
    })
  }
  setDateAvailable(day){
    this.setState({available: day})
  }
  handleSubmit(e){
    e.preventDefault();
    let { bedrooms, bathrooms, rent, deposit, unit, headline, description, available } = this.state;
    let body = JSON.stringify({
      bedrooms: bedrooms,
      bathrooms: bathrooms,
      rent: rent,
      deposit: deposit,
      unit: unit,
      headline: headline,
      description: description,
      available: available
    });
    APIManager.update(`/m/listings/${this.props.match.params.id}`, body, (err, response) => {
      if(err){
        console.log(err);
        return;
      }
      this.props.history.push(`/m/properties/${this.state.property}`);
    });
  }
  handleActiveToggle(){
    let isActive = !this.state.isActive;
    this.setState({isActive: isActive});
    let body = JSON.stringify({
      active: isActive
    })
    APIManager.update(`/m/listings/${this.props.match.params.id}`, body, (err, response) => {
      if(err){
        console.log(error);
        this.setState({isActive: !isActive});
        return;
      }
      console.log(response);
    })
  }
  render(){
    let { loading, bedrooms, bathrooms, rent, deposit, unit, headline, description, image, isActive, available } = this.state;
    if(!loading){
      return(
        <div>
          <Subheader
            title={
              <span>
                <p>EDIT LISTING FOR</p>
                <h2>Unit {unit}</h2>
              </span>
            }
            button={
              <Link to={{pathname: `/m/properties/${this.state.property}`, state: {page: 1}}}>
                <BorderButton
                  width="73px"
                  height="35px"
                  font="13px"
                >
                  Done
                </BorderButton>
              </Link>
            }
          />
          <div className={styles.photoContainer}>
            <ImageUploader image={image} uploadImage={this.uploadImage}
              placeholder={
                <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24"><path fill="#d3d3d3" d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg>
              }
            />
          </div>
          <div className={styles.editContainer}>
            <div className={styles.activeToggle}><span>Active:</span><Toggle isToggled={isActive} handleToggle={this.handleActiveToggle} /></div>
            <form onSubmit={this.handleSubmit}>
              <label for="headline">HEADLINE</label>
              <input name='headline' type='text' value={headline} onChange={this.handleInputChange} className={styles.input} />
              <label for="description">DESCRIPTION</label>
              <textarea rows="4" name='description' type='text' value={description} onChange={this.handleInputChange} className={styles.input} />
              <label for="unit">UNIT #</label>
              <input name='unit' type='number' value={unit} onChange={this.handleInputChange} className={styles.input} />
              <label for="bathrooms">BEDROOMS</label>
              <input name='bedrooms' type='number' value={bedrooms} onChange={this.handleInputChange} className={styles.input} />
              <label for="bathrooms">BATHROOMS</label>
              <input name='bathrooms' type='number' value={bathrooms} onChange={this.handleInputChange} className={styles.input} />
              <label for="rent">RENT</label>
              <input name='rent' type='number' value={rent} onChange={this.handleInputChange} className={styles.input} />
              <label for="deposit">DEPOSIT</label>
              <input name='deposit' type='number' value={deposit} onChange={this.handleInputChange} />
              <label>AVAILABLE</label>
              <DatePicker
                selected={available}
                onChange={this.setDateAvailable}
                placeholderText="MM/DD/YYYY"
              />
              <button style={{display: 'none'}} type="submit" />
              <FilledButton
                height="35px"
                width="100%"
                font="12px"
                onClick={this.handleSubmit}
              >
                Create Listing
              </FilledButton>
            </form>
          </div>
        </div>
      );
    } else {
      return(
        <LoadSpinner />
      );
    }
  }
}

export default ListingEditForm;
