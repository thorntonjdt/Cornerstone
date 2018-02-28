import React from 'react';
import { Link } from 'react-router-dom';

import { getRequest, uploadImage, updateRequest, deleteRequest } from 'utils/APIManager';
import Subheader from 'components/Subheader/Subheader';
import Input from 'components/Input/Input';
import ImageUploader from 'components/ImageUploader/ImageUploader';
import BorderButton from 'components/BorderButton/BorderButton';
import FilledButton from 'components/FilledButton/FilledButton';
import LoadSpinner from 'components/LoadSpinner/LoadSpinner';

import styles from './PropertyEditForm.css';

class PropertyEditForm extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      editing: false,
      loading: true,
      address: '',
      city: '',
      state: '',
      zip: '',
      image: null,
      listing: '',
      errors: ''
    };
    this.toggleEdit = this.toggleEdit.bind(this);
    this.uploadImage = this.uploadImage.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.deleteProperty = this.deleteProperty.bind(this);
    this.validateFields = this.validateFields.bind(this);
  }
  componentDidMount(){
    getRequest(`/m/properties/${this.props.match.params.id}/edit`, (err,response) => {
      if(err){
        console.log(err);
        return;
      }
      this.setState({address: response.address, city: response.city, state: response.state, zip: response.zip, image: response.img, listing: response.listings.length, loading: false})
    })
  }
  toggleEdit(e){
    e.preventDefault();
    this.setState({editing: !this.state.editing})
  }
  uploadImage(image){
    uploadImage(`/m/properties/${this.props.match.params.id}/picture`, image, (err) => {
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
      let { address, city, state, zip } = this.state;
      let str = address+", "+city+", "+state;
      let replaced = str.replace(/\s/g, '+');
      fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${replaced}&key=AIzaSyDLN1zBL_sAjEQwJ2843b1W_B_SlkH1eLs`)
      .then(response => response.json())
      .then(({results, status}) => {
        if(status != "OK"){
          this.setState({errors: {form: "Address does not exist."}})
          return;
        }
        let body = {
          address: address,
          city: city,
          state: state,
          zip: zip,
          coords: [results[0].geometry.location.lng, results[0].geometry.location.lat]
        };

        updateRequest(`/m/properties/${this.props.match.params.id}`, body, (err, response) => {
          if(err){
            this.setState({errors: {form: "A property with this address already exists."}})
            return;
          }
          this.setState({editing: false, errors: ''});
        });
      })
    } else {
        this.setState({errors: errors})
    }
  }
  deleteProperty(){
    deleteRequest(`/m/properties/${this.props.match.params.id}`, (err) => {
      if(err){
        console.log(err);
        return;
      }
      this.props.history.push('/m/properties');
    })
	}
  validateFields(){
    let { address, city, state, zip } = this.state;
    const errors = {};
    errors.address = !address ? true : false;
    errors.city = !city ? true : false;
    errors.state = !state ? true : false;
    errors.zip = !zip ? true : false;
    return errors;
  }
  render() {
    let { loading, editing, address, city, state, zip, image, listing, errors } = this.state;
    if(loading){
      return(
        <LoadSpinner />
      )
    } else {
      return (
        <div>
          <Subheader
            title={
              <span>
                <p>EDIT PROPERTY</p>
                <h2>{address}</h2>
              </span>
            }
            button={
                <Link to={`/m/properties/${this.props.match.params.id}`}>
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
              {editing ?
                <form onSubmit={this.handleSubmit}>
                  <Input name="address" label="street address" value={address} hasError={errors.address} onChange={this.handleInputChange} />
                  <div className={styles.row}>
                    <Input name="city" label="city" value={city} hasError={errors.city} onChange={this.handleInputChange} />
                    <Input name="state" label="state" value={state} hasError={errors.state} onChange={this.handleInputChange} />
                    <Input name="zip" label="zip" value={zip} hasError={errors.zip} onChange={this.handleInputChange} />
                  </div>
                  {errors.form && <div className={styles.error}>{errors.form}</div>}
                  <button style={{display: 'none'}} type="submit" />
                  <span className={styles.submitBtn}>
                    <FilledButton
                      width="110px"
                      height="35px"
                      font="12px"
                      onClick={this.handleSubmit}
                    >
                      Save Address
                    </FilledButton>
                  </span>
                  <span className={styles.edit} onClick={this.toggleEdit}>Cancel</span>
                </form>
              :
                <div>
                  <h4>Property Address</h4>
                  <p>{address}</p>
                  <p>{city}, {state}, {zip}</p>
                  <span className={styles.edit} onClick={this.toggleEdit}>Edit Address</span>
                </div>
              }
              <hr />
              <div className={styles.borderedRow}>
                <span>
                  {listing ?
                    <span className={styles.active}>
                      Active Listings
                    </span>
                  :
                    <span className={styles.inactive}>
                      No Active Listings
                    </span>
                  }
                </span>
                <span className={styles.link}>
                  <Link to={{pathname: `/m/properties/${this.props.match.params.id}`, state: {page: 1}}}>View Listings</Link>
                </span>
              </div>
              <hr />
              <span onClick={this.deleteProperty} className={styles.delete}>Delete Property</span>
            </div>
          </div>
      );
    }
  }
}

export default PropertyEditForm;
