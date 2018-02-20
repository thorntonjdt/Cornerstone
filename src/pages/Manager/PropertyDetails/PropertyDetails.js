import React from 'react';
import { Link } from 'react-router-dom';
import APIManager from 'utils/APIManager.js';

import Image from 'components/Image/Image.js';
import Tabs from 'components/Tabs/Tabs.js';
import Tab from 'components/Tab/Tab.js';
import Leases from 'components/Leases/Leases.js';
import Listings from 'components/Listings/Listings.js';
import Applications from 'components/Applications/Applications.js';
import FilledButton from 'components/FilledButton/FilledButton.js';
import Circle from 'components/Circle/Circle.js';
import LoadSpinner from 'components/LoadSpinner/LoadSpinner.js';

import styles from './PropertyDetails.css';

class PropertyDetails extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      loading: true,
      address: '',
      city: '',
      state: '',
      zip: '',
      img: null,
      listings: [],
      applications: [],
      leases: [],
      page: props.location.state ? props.location.state.page : 0
    }
    this.toggleArchive = this.toggleArchive.bind(this);
  }
  componentDidMount(){
    APIManager.getById(this.props.location.pathname, (err, response) => {
      if(err){
        console.log(err);
        return;
      }
      this.setState({ address: response.address, city: response.city, state: response.state, zip: response.zip, listings: response.listings, applications: response.applications, leases: response.lease, img: response.img, loading: false })
    })
  }
  toggleArchive(id, archived){
    let { applications } = this.state;
    let newArray = applications.slice();
    let appIndex = applications.findIndex((app => app._id == id));
    newArray[appIndex].archived = !archived;
    this.setState({applications: newArray})
    let body = JSON.stringify({
      archived: !archived
    });
    APIManager.update(`/m/applications/${id}`, body, (err, response) => {
      if(err){
        console.log(err);
        this.setState({applications: applications})
        return;
      }
    })
  }
  render(){
    let { address, city, state, zip, listings, applications, leases, img, loading, page } = this.state;
    if(!loading){
      return(
        <div>
          <div className={styles.header}>
            <Link to="/m/properties" className={styles.back}>ALL PROPERTIES</Link>
            <div className={styles.propertyInfo}>
              <Link to={`${this.props.match.url}/update`}>
                <Image
                  image={img}
                  width="65px"
                  height="65px"
                />
              </Link>
              <div className={styles.details}>
                <h2>{address}</h2>
                <span className={styles.address}>{city}, {state} {zip}&nbsp;&nbsp;•&nbsp;&nbsp;</span>
                <span className={styles.edit}>
                  <Link to={`${this.props.match.url}/update`}>
                    Edit property
                  </Link>
                </span>
              </div>
            </div>
        </div>
        <Tabs active={page}>
          <Tab text="Leases">
            <Leases property={this.props.match.params.id} address={address} />
          </Tab>
          <Tab text="Listings">
            <Listings property={this.props.match.params.id} />
          </Tab>
          <Tab text="Applications">
            {applications.length > 0 ?
              <Applications applications={applications} toggleArchive={this.toggleArchive} />
            :
              <div className={styles.center}>
                <Circle>
                  <svg height="50" width="50" viewBox="0 0 24 24">
                    <path fill="#FF6B6B" d="M20 6h-8l-2-2H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-5 3c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2zm4 8h-8v-1c0-1.33 2.67-2 4-2s4 .67 4 2v1z"></path>
                  </svg>
                </Circle>
                <h1>No Applications to Show</h1>
                <p>Create a listing in order for tenants to apply to your properties.</p>
                <Link className={styles.createBtn} to={{pathname:`/m/listings/new`, state: { propertyId: this.props.match.params.id }}}>
                  <FilledButton
                    width="100%"
                    height="48px"
                    font="14px"
                  >
                    Create a listing
                  </FilledButton>
                </Link>
              </div>
            }
          </Tab>
        </Tabs>
      </div>
      )
    } else {
      return(
        <LoadSpinner />
      )
    }
  }
}

export default PropertyDetails;
