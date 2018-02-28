import React from 'react';
import { Link } from 'react-router-dom';

import formatDate from 'utils/DateFormatter';
import { getRequest, createRequest } from 'utils/APIManager';
import FilledButton from 'components/FilledButton/FilledButton';
import Image from 'components/Image/Image';
import Card from 'components/Card/Card';
import ApplicationTile from 'components/ApplicationTile/ApplicationTile';
import ApplicationAuth from 'components/ApplicationAuth/ApplicationAuth';
import ListingMap from 'components/ListingMap/ListingMap';
import LoadSpinner from 'components/LoadSpinner/LoadSpinner';

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
    getRequest(`/p${this.props.match.url}`, (err, response) => {
      if(err){
        console.log(err);
        return;
      }
      if(response.active){
        var applied = false;
        if(this.props.user){
          for(var i = 0; i < response.applications.length; i++){
            if(response.applications[i].applicant == this.props.user.id){
              applied = true;
              break;
            }
          }
        }
        this.setState({
          propertyId: response.property._id,
          image: response.image,
          address: response.property.address,
          city: response.property.city,
          state: response.property.state,
          zip: response.property.zip,
          coords: response.property.coords,
          bedrooms: response.bedrooms,
          bathrooms: response.bathrooms,
          rent: response.rent,
          headline: response.headline,
          description: response.description,
          manager: response.property.manager,
          applied: applied,
          deposit: response.deposit,
          available: response.available,
          loading: false
        })
      } else {
        this.setState({active: false, loading: false})
      }
    })
  }
  sendApplication(){
    let body = {
      user: this.props.user.id,
      tenant: this.props.user.tenant,
      address: this.state.address
    };
    createRequest(`/t/users/${this.state.manager}/properties/${this.state.propertyId}${this.props.match.url}/applications`, body, (err, response) => {
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
                    <ListingMap center={{lat: coords[1], lng: coords[0]}} style={{position: 'relative', width: '100%', height: 400, marginTop: 10}}/>
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
