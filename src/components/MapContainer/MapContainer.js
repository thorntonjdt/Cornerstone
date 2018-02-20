import React from 'react'
import {Map, InfoWindow, Marker, GoogleApiWrapper} from 'google-maps-react';

export class MapContainer extends React.Component {
render() {
  let { google, style, center } = this.props;
    return (
        <Map
          google={google}
          zoom={14}
          containerStyle={style}
          initialCenter={center}
        >

          <Marker
              position={center}/>

        </Map>
    );
  }
}

export default GoogleApiWrapper({
  apiKey: ("AIzaSyDLN1zBL_sAjEQwJ2843b1W_B_SlkH1eLs")
})(MapContainer)
