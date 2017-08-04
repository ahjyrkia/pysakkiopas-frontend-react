import React, { Component } from 'react';
import {Map, FeatureGroup, TileLayer} from 'react-leaflet';
import stopService from '../services/stopService.jsx';
import StopComponent from './StopComponent.jsx';
import UserComponent from './UserComponent.jsx';

import '../css/popup.css';

class MapComponent extends Component {
  constructor(props) {
    super(props)
    this.state = {
      leafletMap: null,
      viewPosition: [60.165426, 24.935081],
      userPosition: [0,0],
      height: window.innerHeight,
      zoom: 15,
      stops: [],
      panToUserLocation: true
    }
    this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
    this.onMoveEvent = this.onMoveEvent.bind(this);
    this.getStopComponents = this.getStopComponents.bind(this);
    this.stops = [];
  }

  componentWillMount() {
    stopService.fetchStopsData().then((response) => {
      this.setState({
        stops: response
      })
    });
  }

  componentDidMount() {
    window.addEventListener('resize', this.updateWindowDimensions);
    const leafletMapNode = this.leafletMap.leafletElement;
    leafletMapNode.invalidateSize();
    leafletMapNode.locate({
      watch: true,
      enableHighAccuracy: false
    });
    this.setState({
      leafletMap: leafletMapNode
    })
  }

  updateWindowDimensions() {
    this.setState({
      height: window.innerHeight
    })
  }

  onMoveEvent(e) {
    var center = e.target.getCenter();
    if (center.lat == null || center.lng == null) return;
    this.setState({
      viewPosition: [center.lat, center.lng],
      zoom: e.target.getZoom()
    })
  }

  onZoomEvent(e) {
    var z = e.target.getZoom();
    if (z == null) return;
    this.setState({
      zoom: z
    })
  }

  userLocationEvent = (e) => {
    const leafletMapNode = this.state.leafletMap;
    if (this.state.panToUserLocation) {
      leafletMapNode.panTo(e.latlng);
      leafletMapNode.setZoom(17);
      this.setState({
        viewPosition: [e.latlng.lat, e.latlng.lng],
        panToUserLocation: false
      })
    }
    this.setState({
      userPosition: [e.latlng.lat, e.latlng.lng]
    })
  }

  getStopComponents() {
    //if (this.state.zoom < 15) return;
    var leafletCircles = this.state.stops.map((stop) => {
      // **
      // TODO fix backend so it returns floats rather than string
      var coords = stop.coords.split(',');
      coords = [parseFloat(coords[0]), parseFloat(coords[1])];
      //**
      if (!stopService.isWithinViewDistance(coords, this.state.viewPosition, this.state.zoom)) return;
      return (
        <StopComponent
          key={stop.code}
          coords={coords}
          type={stop.type}
          zoom={this.state.zoom}
          code={stop.code}
          map={this.state.leafletMap}
        />
      )

    });
    return leafletCircles;
  }

  render() {
    return (
      <div className="MapComponent">
        <Map
          ref={map => {this.leafletMap = map;}}
          center={this.state.viewPosition}
          style={{height:this.state.height}}
          zoom={this.state.zoom}
          minZoom={13}
          maxZoom={19}
          onMoveend={(e) => {this.onMoveEvent(e)}}
          onZoomEnd={(e) => {this.onZoomEvent(e)}}
          onlocationfound={(e) => {this.userLocationEvent(e)}}
          >
          <TileLayer
            url='https://api.digitransit.fi/map/v1/{id}/{z}/{x}/{y}.png'
            attribution='Map data &copy; <a href="https://openstreetmap.org">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, '
            id='hsl-map'
          />
          <FeatureGroup>
            {this.getStopComponents()}
            <UserComponent
              coords={this.state.userPosition}
              zoom={this.state.zoom}
              type={"user"}
            />
          </FeatureGroup>
        </Map>
      </div>
    );
  }
}

export default MapComponent;
