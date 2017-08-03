import React, { Component } from 'react';
import {Map, FeatureGroup, TileLayer} from 'react-leaflet';
import stopService from '../services/stopService.jsx';
import StopComponent from './StopComponent.jsx';

class MapComponent extends Component {
  constructor(props) {
    super(props)
    this.state = {
      viewPosition: [60.230605, 25.029178],
      userPosition: null,
      height: window.innerHeight,
      zoom: 17,
      stops: []
    }
    this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
    this.fetchStops = this.fetchStops.bind(this);
    this.onMoveEvent = this.onMoveEvent.bind(this);
    this.getStopComponents = this.getStopComponents.bind(this);
    this.changeViewPosition = this.changeViewPosition.bind(this);
  }

  componentWillMount() {
    this.fetchStops();
  }

  componentDidMount() {
    this.updateWindowDimensions();
    window.addEventListener('resize', this.updateWindowDimensions);
  }

  updateWindowDimensions() {
    this.setState({
      height: window.innerHeight
    })
  }

  fetchStops() {
    return fetch('https://pysakkiopas-backend.herokuapp.com/stop')
      .then((response) => response.json())
      .then((responseJson) => {
        this.setState({
          stops: responseJson
        })
      })
      .catch((error) => {
        console.error(error);
    });
  }

  onMoveEvent(e) {
    var center = e.target.getCenter();
    this.setState({
      viewPosition: [center.lat, center.lng],
      zoom: e.target.getZoom()
    })
  }

  changeViewPosition(coords) {
    this.setState({
      viewPosition: coords
    })
  }

  getStopComponents() {
    if (this.state.zoom < 15) return;
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
          changeViewPosition={this.changeViewPosition}
        />
      )
    });
    return leafletCircles;
  }

  render() {
    return (
      <div className="MapComponent">
        <Map
          center={this.state.viewPosition}
          style={{height:this.state.height}}
          zoom={this.state.zoom}
          minZoom={13}
          maxZoom={19}
          onDragEnd={(e) => {this.onMoveEvent(e)}}
          onZoom={(e) => {this.onMoveEvent(e)}}
          >
          <TileLayer
            url='http://api.digitransit.fi/map/v1/{id}/{z}/{x}/{y}.png'
            attribution='Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, '
            id='hsl-map'
          />
          <FeatureGroup>
            {this.getStopComponents()}
          </FeatureGroup>
        </Map>
      </div>
    );
  }
}

export default MapComponent;
