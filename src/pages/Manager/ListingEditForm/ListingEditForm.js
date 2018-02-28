import React from 'react';
import { Link } from 'react-router-dom';

import DatePicker from 'react-datepicker';
import moment from 'moment';
import { getRequest, uploadImage, updateRequest } from 'utils/APIManager';
import Subheader from 'components/Subheader/Subheader';
import Input from 'components/Input/Input';
import BorderButton from 'components/BorderButton/BorderButton';
import FilledButton from 'components/FilledButton/FilledButton';
import ImageUploader from 'components/ImageUploader/ImageUploader';
import Toggle from 'components/Toggle/Toggle';
import LoadSpinner from 'components/LoadSpinner/LoadSpinner';

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
      loading: true,
      errors: ''
    }
    this.uploadImage = this.uploadImage.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleActiveToggle = this.handleActiveToggle.bind(this);
    this.setDateAvailable = this.setDateAvailable.bind(this);
    this.validateFields = this.validateFields.bind(this);
  }
  componentDidMount(){
    getRequest(`/m/listings/${this.props.match.params.id}`, (err, response) => {
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
    uploadImage(`/m/listings/${this.props.match.params.id}/picture`, image, (err) => {
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
    const errors = this.validateFields();
    const noErrors = Object.keys(errors).every(i => !errors[i])
    if(noErrors){
      let { bedrooms, bathrooms, rent, deposit, unit, headline, description, available } = this.state;
      let body = {
        bedrooms: bedrooms,
        bathrooms: bathrooms,
        rent: rent,
        deposit: deposit,
        unit: unit,
        headline: headline,
        description: description,
        available: available
      };

      updateRequest(`/m/listings/${this.props.match.params.id}`, body, (err, response) => {
        if(err){
          console.log(err);
          return;
        }
        this.props.history.push(`/m/properties/${this.state.property}`);
      });
    } else {
      this.setState({errors: errors})
    }
  }
  handleActiveToggle(){
    let isActive = !this.state.isActive;
    this.setState({isActive: isActive});
    let body = {
      active: isActive
    }

    updateRequest(`/m/listings/${this.props.match.params.id}`, body, (err, response) => {
      if(err){
        console.log(error);
        this.setState({isActive: !isActive});
        return;
      }
      console.log(response);
    })
  }
  validateFields(){
    let { bedrooms, bathrooms, rent, unit, headline, description } = this.state;
    const errors = {};
    errors.headline = !headline ? true : false;
    errors.description = !description ? true : false;
    errors.unit = !unit || isNaN(unit) || unit <= 0 ? true : false;
    errors.bedrooms = !bedrooms || isNaN(bedrooms) || bedrooms <= 0 ? true : false;
    errors.bathrooms = !bathrooms || isNaN(bathrooms) || bathrooms <= 0 ? true : false;
    errors.rent = !rent || isNaN(rent) || rent <= 0 ? true : false;
    return errors;
  }
  render(){
    let { loading, bedrooms, bathrooms, rent, deposit, unit, headline, description, image, isActive, available, errors } = this.state;
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
              <Input name="headline" label="headline" value={headline} hasError={errors["headline"]} onChange={this.handleInputChange} />
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
