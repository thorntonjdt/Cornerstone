import React from 'react';
import {Map, Marker, InfoWindow, GoogleApiWrapper} from 'google-maps-react';

import Image from 'components/Image/Image.js';

import styles from './MapContainer.css';

export class MapContainer extends React.Component {
  constructor(){
    super();
    this.state = {
      showingInfoWindow: false,
      activeMarker: {},
      selectedPlace: {}
    }
    this.onMarkerClick = this.onMarkerClick.bind(this);
    this.onInfoWindowClose = this.onInfoWindowClose.bind(this);
    this.onMapClicked = this.onMapClicked.bind(this);
    this.centerMoved = this.centerMoved.bind(this);
    this.findDistance = this.findDistance.bind(this);
  }
  onMarkerClick(props, marker, e){
    this.setState({
      selectedPlace: props,
      activeMarker: marker,
      showingInfoWindow: true
    })
  }
  onInfoWindowClose(){
    this.setState({
      showingInfoWindow: false,
      activeMarker: null
    })
  }
  onMapClicked(props) {
    if(this.state.showingInfoWindow){
      this.setState({
        showingInfoWindow: false,
        activeMarker: null
      })
    }
  }
  centerMoved(mapProps, map){
    let lng1 = map.center.lng();
    let lat1 = map.center.lat();
    let lng2 = mapProps.initialCenter.lng;
    let lat2 = mapProps.initialCenter.lat;

    let distance = this.findDistance(lng1, lat1, lng2, lat2);

    if(distance >= 10){
      this.props.fetchNearbyMarkers({lng: lng1, lat: lat1});
    }
  }
  findDistance(lng1, lat1, lng2, lat2){
    var p = 0.017453292519943295;
    var c = Math.cos;
    var a = 0.5 - c((lat2 - lat1) * p)/2 +
            c(lat1 * p) * c(lat2 * p) *
            (1 - c((lng2 - lng1) * p))/2;

    return 12742 * Math.asin(Math.sqrt(a));
  }
  render() {
    let { google, style, center, markers } = this.props;
    let { activeMarker, showingInfoWindow, selectedPlace } = this.state;
    return (
        <Map
          google={google}
          zoom={13}
          containerStyle={style}
          initialCenter={center}
          center={center}
          onClick={this.onMapClicked}
          onDragend={this.centerMoved}
        >
          {markers.map(marker =>
            <Marker
              onClick={this.onMarkerClick}
              position={{lat: marker.location.coordinates[1], lng: marker.location.coordinates[0]}}
              title={marker.property.address}
              rent={marker.rent}
              image={marker.image}
              id={marker._id}
            />
          )}
          <InfoWindow
            marker={activeMarker}
            visible={showingInfoWindow}
            onClose={this.onInfoWindowClose}
          >
            <div>
              <Image image={selectedPlace.image} height="75px" width="75px" />
              <div className={styles.rent}>${selectedPlace.rent}</div>
            </div>
          </InfoWindow>
        </Map>
    );
  }
}

export default GoogleApiWrapper({
  apiKey: ("AIzaSyDLN1zBL_sAjEQwJ2843b1W_B_SlkH1eLs")
})(MapContainer)
