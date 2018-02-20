import React from 'react';
import { Link } from 'react-router-dom';

import formatDate from 'utils/DateFormatter/DateFormatter.js';
import APIManager from 'utils/APIManager.js';
import Logo from 'components/Logo/Logo.js';
import FilledButton from 'components/FilledButton/FilledButton.js';
import Image from 'components/Image/Image.js';
import Card from 'components/Card/Card.js';
import ApplicationTile from 'components/ApplicationTile/ApplicationTile.js';
import ApplicationAuth from 'components/ApplicationAuth/ApplicationAuth.js';
import MapContainer from 'components/MapContainer/MapContainer.js';
import LoadSpinner from 'components/LoadSpinner/LoadSpinner.js';

import styles from './Listing.css';

class Listing extends React.Component {
  constructor(){
    super();
    this.state = {
      propertyId: '',
      image: '',
      address: '',
      city: '',
      state: '',
      zip: '',
      coords: [],
      bedrooms: '',
      bathrooms: '',
      rent: '',
      description: '',
      headline: '',
      applied: false,
      deposit: '',
      available: '',
      loading: true,
      active: true
    }
    this.sendApplication = this.sendApplication.bind(this);
  }
  componentDidMount(){
    fetch(`http://localhost:3000/api/v1/p${this.props.match.url}`)
			.then(response => response.json())
			.then(({payload, error}) => {
        if(error){
          console.log(error);
          return;
        }
        if(payload.active){
          console.log('ok');
          var applied = false;
          if(this.props.user){
            for(var i = 0; i < payload.applications.length; i++){
              if(payload.applications[i].applicant == this.props.user.id){
                applied = true;
                break;
              }
            }
          }
          this.setState({
            propertyId: payload.property._id,
            image: payload.image,
            address: payload.property.address,
            city: payload.property.city,
            state: payload.property.state,
            zip: payload.property.zip,
            coords: payload.property.coords,
            bedrooms: payload.bedrooms,
            bathrooms: payload.bathrooms,
            rent: payload.rent,
            headline: payload.headline,
            description: payload.description,
            manager: payload.property.manager,
            applied: applied,
            deposit: payload.deposit,
            available: payload.available,
            loading: false
          })
        } else {
          this.setState({active: false, loading: false})
        }
      });
  }
  sendApplication(){
    let body = JSON.stringify({
      user: this.props.user.id,
      tenant: this.props.user.tenant,
      address: this.state.address
    });
    APIManager.create(`/t/users/${this.state.manager}/properties/${this.state.propertyId}${this.props.match.url}/applications`, body, (err, response) => {
      if(err){
        console.log(err);
        return;
      }
      this.setState({applied: true});
    })
  }
  render(){

    if(this.state.loading)
    return(
      <LoadSpinner />
    )

    else if(!this.state.active)
    return(
      <div>
        This listing is no longer active
      </div>
    )

    else {
      let { image, address, city, state, zip, coords, headline, description, bedrooms, bathrooms, rent, applied, deposit, available } = this.state;
      if(available && available < Date.now()){
        var date = formatDate(available);
      }
      return(
        <div>
          <header className={styles.header}></header>
            <div className={styles.image}>
              <Image
                image={image}
                height="100%"
                width="100%"
              />
            </div>
            <div className={styles.info}>
              <h4>{address}<br />{city}, {state}, {zip}</h4>
              <ul className={styles.details}>
                <li><h4>{bedrooms} Bed</h4></li>
                <li><h4>{bathrooms} Bath</h4></li>
                <li><h4>${rent}/mo.</h4></li>
              </ul>
            </div>
          <div className={styles.space}>
            <div className={styles.application}>
              <Card>
                <div className={styles.padding}>
                  {this.props.user ?
                    <ApplicationTile user={this.props.user} applied={applied}  logout={this.props.logout} sendApplication={this.sendApplication} />
                  :
                    <ApplicationAuth login={this.props.login} />
                  }
                </div>
              </Card>
            </div>
            <div className={styles.container}>
              <Card>
                <div className={styles.padding}>
                  <h4>{headline}</h4>
                  <p>{description}</p>
                  {(deposit || date) &&
                    <div className={styles.margin}>
                      <h5>Move-In Details</h5>
                      {date && <p>Preferred Move-In: <b>{date}</b></p>}
                      {deposit && <p>Security Deposit: <b>${deposit}.00</b></p>}
                    </div>
                  }
                  <div className={styles.locationContainer}>
                    <h5>Location</h5>
                    <a className={styles.link} href={`https://maps.google.com/?q=${address} ${city} ${state} ${zip}`}>{address}, {city}, {state} {zip}</a>
                    <MapContainer center={{lat: coords[1], lng: coords[0]}} style={{position: 'relative', width: '100%', height: 400, marginTop: 10}}/>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      )
    }
  }
}

export default Listing;
