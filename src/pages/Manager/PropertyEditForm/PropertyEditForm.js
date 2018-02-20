import React from 'react';
import { Link } from 'react-router-dom';

import APIManager from 'utils/APIManager.js';
import Subheader from 'components/Subheader/Subheader.js';
import ImageUploader from 'components/ImageUploader/ImageUploader.js';
import BorderButton from 'components/BorderButton/BorderButton.js';
import FilledButton from 'components/FilledButton/FilledButton.js';
import LoadSpinner from 'components/LoadSpinner/LoadSpinner.js';

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
      listing: ''
    };
    this.toggleEdit = this.toggleEdit.bind(this);
    this.uploadImage = this.uploadImage.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.deleteProperty = this.deleteProperty.bind(this);
  }
  componentDidMount(){
    APIManager.getById(`/m/properties/${this.props.match.params.id}/edit`, (err,response) => {
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
    APIManager.uploadImage(`/m/properties/${this.props.match.params.id}/picture`, image, (err) => {
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
    let { address, city, state, zip } = this.state;
    let str = address+", "+city+", "+state;
    let replaced = str.replace(/\s/g, '+');
    fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${replaced}&key=AIzaSyDLN1zBL_sAjEQwJ2843b1W_B_SlkH1eLs`)
    .then(response => response.json())
    .then(({results}) => {
      let body = JSON.stringify({
        address: address,
        city: city,
        state: state,
        zip: zip,
        lat: results[0].geometry.location.lat,
        lng: results[0].geometry.location.lng
      });
      APIManager.update(`/m/properties/${this.props.match.params.id}`, body, (err, response) => {
        if(err){
          console.log(err);
          return;
        }
        this.setState({editing: false});
      });
    });
  }
  deleteProperty(){
    APIManager.delete(`/m/properties/${this.props.match.params.id}`, (err) => {
      if(err){
        console.log(err);
        return;
      }
      this.props.history.push('/m/properties');
    })
	}
  render() {
    let { loading, editing, address, city, state, zip, image, listing } = this.state;
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
                  <div>
                    <label for='address'>STREET ADDRESS</label>
                    <input name='address' type='text' value={address} onChange={this.handleInputChange} />
                  </div>
                  <div className={styles.row}>
                    <span>
                      <label for="city">CITY</label>
                      <input name='city' type='text' value={city} onChange={this.handleInputChange} />
                    </span>
                    <span>
                      <label for="state">STATE</label>
                      <input name='state' type='text' value={state} onChange={this.handleInputChange} />
                    </span>
                    <span>
                      <label for="zip">ZIP</label>
                      <input name='zip' type='text' value={zip} onChange={this.handleInputChange} />
                    </span>
                  </div>
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
                      Listing
                    </span>
                  :
                    <span className={styles.inactive}>
                      No Listing
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
