import React from 'react';
import { Link } from 'react-router-dom';
import APIManager from 'utils/APIManager.js';

import Subheader from 'components/Subheader/Subheader.js';
import Input from 'components/Input/Input.js';
import ImageUploader from 'components/ImageUploader/ImageUploader.js';
import BorderButton from 'components/BorderButton/BorderButton.js';
import FilledButton from 'components/FilledButton/FilledButton.js';

import styles from './PropertyForm.css';

class PropertyForm extends React.Component {
  constructor(){
    super();
    this.state = {
      address: '',
      city: '',
      state: '',
      zip: '',
      image: null,
      file: null,
      errors: '',
      processing: false
    };
    this.uploadImage = this.uploadImage.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.validateFields = this.validateFields.bind(this);
  }
  uploadImage(image){
    var reader = new FileReader();
    reader.addEventListener("load", () => {
      this.setState({file: image, image: reader.result});
    }, false);
    reader.readAsDataURL(image);
  }
  handleInputChange(event) {
    const target = event.target;
    const value = target.value;
    const name = target.name;

    this.setState({
      [name]: value
    });
  }

  handleSubmit(e){
    e.preventDefault();
    const errors = this.validateFields();
    const noErrors = Object.keys(errors).every(i => !errors[i])
    if(noErrors){
      let { address, city, state, zip, file } = this.state;
      let str = address+", "+city+", "+state;
      let replaced = str.replace(/\s/g, '+');
      fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${replaced}&key=AIzaSyDLN1zBL_sAjEQwJ2843b1W_B_SlkH1eLs`)
      .then(response => response.json())
      .then(({results, status}) => {
        if(status != "OK"){
          this.setState({errors: {form: "Address does not exist."}})
        }
        let body = JSON.stringify({
          address: address,
          city: city,
          state: state,
          zip: zip,
          lat: results[0].geometry.location.lat,
          lng: results[0].geometry.location.lng
        });
        APIManager.create(`/m/managers/${this.props.manager}/properties`, body, (err, response) => {
          if(err){
            this.setState({errors: {form: "A property with this address already exists."}})
            return;
          }
          if(file){
            APIManager.uploadImage(`/m/properties/${response}/picture`, file, (error) => {
              if(error){
                this.setState({errors: {form: "Unable to upload image."}})
                return;
              }
            })
          }
          this.props.history.push('/m/properties/'+response);
        });
      });
    } else {
      this.setState({errors: errors})
    }
  }
  validateFields(){
    let { address, city, state, zip, file } = this.state;
    const errors = {};
    errors.address = !address ? true : false;
    errors.city = !city ? true : false;
    errors.state = !state ? true : false;
    errors.zip = !zip ? true : false;
    errors.form = !file ? "A cover image is required" : false;
    return errors;
  }
  render() {
    let { address, city, state, zip, image, errors } = this.state;
    return (
      <div>
        <Subheader
          title={<h2>Create a New Property</h2>}
          button={
            <Link to="/m/properties">
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
          <ImageUploader image={image} uploadImage={this.uploadImage} hasError={errors["file"]}
            placeholder={
              <svg xmlns="http://www.w3.org/2000/svg" width="75" height="75" viewBox="0 0 24 24"><path fill="#d3d3d3" d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg>
            }
          />
        </div>
        <div className={styles.formContainer}>
          <form onSubmit={this.handleSubmit} className={styles.form}>
            <Input name="address" label="street address" value={address} hasError={errors["address"]} onChange={this.handleInputChange} />
            <div className={styles.row}>
              <Input name="city" label="city" value={city} hasError={errors["city"]} onChange={this.handleInputChange} />
              <Input name="state" label="state" value={state} hasError={errors["state"]} onChange={this.handleInputChange} />
              <Input name="zip" label="zip" value={zip} hasError={errors["zip"]} onChange={this.handleInputChange} />
            </div>
            {errors["form"] && <div className={styles.error}>{errors["form"]}</div>}
            <button style={{display: 'none'}} type="submit" />
            <FilledButton
              width="100%"
              height="35px"
              font="12.5px"
              onClick={this.handleSubmit}
            >
              Create property
            </FilledButton>
          </form>
        </div>
      </div>
    );
  }
}

export default PropertyForm;
