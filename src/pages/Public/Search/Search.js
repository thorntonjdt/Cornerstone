import React from 'react';

import { getRequest } from 'utils/APIManager';
import { googleKey } from 'utils/config';
import SearchMap from 'components/SearchMap/SearchMap';
import ListingCard from 'components/ListingCard/ListingCard';
import LoadSpinner from 'components/LoadSpinner/LoadSpinner';

import styles from './Search.css';

class Search extends React.Component {
  constructor({location}){
    super({location});
    this.state = {
      loading: true,
      value: (location.state && location.state.search) ? location.state.search : "",
      listings: [],
      coords: {}
    }
    this.handleInputChange = this.handleInputChange.bind(this);
    this.fetchNearbyListings = this.fetchNearbyListings.bind(this);
    this.getCoordsThenNearbyListings = this.getCoordsThenNearbyListings.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
  }
  componentDidMount(){
    if (this.state.value) {
      this.getCoordsThenNearbyListings(this.state.value)
    }
    else if(navigator.geolocation){
      navigator.geolocation.getCurrentPosition(({coords}) => {
        this.fetchNearbyListings({lng: coords.longitude, lat: coords.latitude})
      });
    } else {
      this.getCoordsThenNearbyListings("Tigard");
    }
  }
  fetchNearbyListings(coords){
    getRequest(`/p/listings/search?lng=${coords.lng}&lat=${coords.lat}`, (err, response) => {
      if(err){
        console.log(err);
        return;
      }
      this.setState({listings: response, coords: coords, loading: false })
    })
  }
  getCoordsThenNearbyListings(location){
    fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${location}&key=${googleKey}`)
    .then(response => response.json())
    .then(({results}) => {
      let coords = results[0].geometry.location;
      this.fetchNearbyListings(coords);
    })
  }
  handleSearch(e){
    e.preventDefault();
    this.getCoordsThenNearbyListings(this.state.value);
  }
  handleInputChange(e){
    this.setState({value: e.target.value});
  }
  render(){
    let { coords, loading, listings, location, value } = this.state;
    return(
      <div className={styles.container}>
        <div className={styles.searchBar}>
          <form className={styles.input} onSubmit={this.handleSearch}>
            <button type="submit" className={styles.hidden} />
            <input type="text" value={value} onChange={this.handleInputChange}  />
            <svg className={styles.inputIcon} width="16" height="16" viewBox="0 0 63 63">
              <path fill="#AAB1AE" d="M55.146,51.887L41.588,37.786c3.486-4.144,5.396-9.358,5.396-14.786c0-12.682-10.318-23-23-23s-23,10.318-23,23  s10.318,23,23,23c4.761,0,9.298-1.436,13.177-4.162l13.661,14.208c0.571,0.593,1.339,0.92,2.162,0.92  c0.779,0,1.518-0.297,2.079-0.837C56.255,54.982,56.293,53.08,55.146,51.887z M23.984,6c9.374,0,17,7.626,17,17s-7.626,17-17,17  s-17-7.626-17-17S14.61,6,23.984,6z" />
            </svg>
          </form>
        </div>
        {loading ?
          <LoadSpinner />
        :
          <div className={styles.content}>
            <div className={styles.map}>
              <SearchMap center={coords} markers={listings} fetchNearbyMarkers={this.fetchNearbyListings} style={{position: 'absolute', top: 1, bottom: 0, left: 0, width: '100%'}} />
            </div>
            {listings.length > 0 ?
              <div className={styles.properties}>
                {listings.map(listing =>
                  <ListingCard key={listing._id} listing={listing} />
                )}
              </div>
            :
              <div className={styles.noProperties}>
                <h1>Couldn't Find Any Listings</h1>
                <p>Move the map or search in another location to find some.</p>
              </div>
            }

          </div>
        }
      </div>
    );
  }
}

export default Search;
