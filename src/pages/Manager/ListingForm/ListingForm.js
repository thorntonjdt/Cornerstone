import React from 'react';
import { Link } from 'react-router-dom';

import DatePicker from 'react-datepicker';
import moment from 'moment';
import { createRequest, uploadImage } from 'utils/APIManager';
import Subheader from 'components/Subheader/Subheader';
import Input from 'components/Input/Input';
import BorderButton from 'components/BorderButton/BorderButton';
import FilledButton from 'components/FilledButton/FilledButton';
import ImageUploader from 'components/ImageUploader/ImageUploader';
import Toggle from 'components/Toggle/Toggle';

import styles from './ListingForm.css';
import 'react-datepicker/dist/react-datepicker-cssmodules.css';

class ListingForm extends React.Component {
  constructor(){
    super();
    this.state = {
      isActive: false,
      bedrooms: '',
      bathrooms: '',
      rent: '',
      deposit: '',
      unit: '',
      headline: '',
      description: '',
      available: '',
      image: null,
      file: null,
      errors: ''
    }
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.uploadImage = this.uploadImage.bind(this);
    this.handleToggle = this.handleToggle.bind(this);
    this.setDateAvailable = this.setDateAvailable.bind(this);
    this.validateFields = this.validateFields.bind(this);
  }
  handleInputChange(event) {
    const target = event.target;
    const value = target.value;
    const name = target.name;

    this.setState({
      [name]: value
    });
  }
  setDateAvailable(day){
    this.setState({available: day})
  }
  handleSubmit(e){
    e.preventDefault();
    const errors = this.validateFields();
    console.log(errors);
    const noErrors = Object.keys(errors).every(i => !errors[i])
    if(noErrors){
      let { available, bedrooms, bathrooms, rent, deposit, unit, headline, description, file, isActive } = this.state;
      let body = {
        bedrooms: bedrooms,
        bathrooms: bathrooms,
        rent: rent,
        deposit: deposit,
        unit: unit,
        headline: headline,
        description: description,
        available: available,
        active: isActive
      };

      createRequest(`/m/managers/${this.props.manager}/properties/${this.props.location.state.propertyId}/listings`, body, (err, response) => {
        if(err){
          this.setState({errors: {form: "Unexpected error. Please try again."}})
          return;
        }
        if(file){
          uploadImage(`/m/listings/${response}/picture`, file, (error) => {
            if(error){
              console.log(error);
              return;
            }
          })
        }
        this.props.history.push({pathname: `/m/properties/${this.props.location.state.propertyId}`, state: {page: 1}});
      });
    } else {
      this.setState({errors: errors})
    }
  }
  uploadImage(image){
    var reader = new FileReader();
    reader.addEventListener("load", () => {
      this.setState({file: image, image: reader.result})
    }, false);
    reader.readAsDataURL(image);
  }
  handleToggle(){
    this.setState({isActive: !this.state.isActive})
  }
  validateFields(){
    let { bedrooms, bathrooms, rent, unit, headline, description, file } = this.state;
    const errors = {};
    errors.headline = !headline ? true : false;
    errors.description = !description ? true : false;
    errors.unit = !unit || isNaN(unit) || unit <= 0 ? true : false;
    errors.bedrooms = !bedrooms || isNaN(bedrooms) || bedrooms <= 0 ? true : false;
    errors.bathrooms = !bathrooms || isNaN(bathrooms) || bathrooms <= 0 ? true : false;
    errors.rent = !rent || isNaN(rent) || rent <= 0 ? true : false;
    //errors.form = !file ? "A cover image is required" : false;
    return errors;
  }
  render(){
    let { bedrooms, bathrooms, available, rent, unit, deposit, headline, description, image, isActive, errors } = this.state;
    return(
      <div>
        <Subheader
          title={<h2>New Listing</h2>}
          button={
            <Link to={{pathname: `/m/properties/${this.props.location.state.propertyId}`, state: {page:1}}}>
              <BorderButton
                width="73px"
                height="35px"
                font="13px"
              >
                Cancel
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
        <div className={styles.formContainer}>
          <div className={styles.activeToggle}><span>Active:</span><Toggle isToggled={isActive} handleToggle={this.handleToggle} /></div>
          <form onSubmit={this.handleSubmit}>
            <Input name="headline" label="headline" value={headline} hasError={errors.headline} onChange={this.handleInputChange} />
            <div className={styles.description}>
              <label for="description">DESCRIPTION</label>
              <textarea style={errors.description ? {borderColor: '#e75b52'} : {}} rows="4" name='description' type='text' value={description} onChange={this.handleInputChange} />
              {errors.description && <div className={styles.errors}>This field is required</div>}
            </div>
            <Input name="unit" label="unit #" value={unit} hasError={errors.unit} onChange={this.handleInputChange} />
            <Input name="bedrooms" label="bedrooms" value={bedrooms} hasError={errors.bedrooms} onChange={this.handleInputChange} />
            <Input name="bathrooms" label="bathrooms" value={bathrooms} hasError={errors.bathrooms} onChange={this.handleInputChange} />
            <Input name="rent" label="rent" value={rent} hasError={errors.rent} onChange={this.handleInputChange} />
            <Input name="deposit" label="deposit" value={deposit} hasError={errors.deposit} onChange={this.handleInputChange} />
            <div style={{marginBottom: 10}}>
              <label>AVAILABLE</label>
              <DatePicker
                selected={available}
                onChange={this.setDateAvailable}
                placeholderText="MM/DD/YYYY"
              />
            </div>
            <button style={{display: 'none'}} type="submit" />
            {errors.form && <div className={styles.error}>{errors.form}</div>}
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
  }
}

export default ListingForm;
