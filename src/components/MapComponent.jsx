import React from 'react';
import {Map, FeatureGroup, Popup, TileLayer} from 'react-leaflet';

const MapComponent = (props) => {
  return (
    <Map
      center={props.viewPosition}
      height={{height:props.height}}
      zoom={8}
      >
      <TileLayer
        url='http://{s}.tile.osm.org/{z}/{x}/{y}.png'
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
      />
    </Map>
  )
}

export default MapComponent;
