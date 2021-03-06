import React from 'react'
import {Map, InfoWindow, Marker, GoogleApiWrapper} from 'google-maps-react';
import { googleKey } from 'utils/config';

export class ListingMap extends React.Component {
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
  apiKey: (googleKey)
})(ListingMap)
