import React, { Component } from 'react';
import {Map, FeatureGroup, Popup, TileLayer} from 'react-leaflet';
import StopService from './services/stopService.jsx';

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      viewPosition: [60.230605, 25.029178],
      userPosition: null,
      height: window.innerHeight,
      zoom: 15,
      stops: []
    }
    this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
    this.fetchStops = this.fetchStops.bind(this);
    this.onDrag = this.onDrag.bind(this);
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

  onDrag(e) {
    console.log(e.target.getZoom())
    var center = e.target.getCenter();
    this.setState({
      viewPosition: [center.lat, center.lng],
      zoom: e.target.getZoom()
    })
  }

  render() {
    return (
      <div className="App">
        <Map
          center={this.state.viewPosition}
          style={{height:this.state.height}}
          zoom={this.state.zoom}
          minZoom={13}
          maxZoom={18}
          onDragEnd={(e) => {this.onDrag(e)}}
          >
          <TileLayer
            url='http://api.digitransit.fi/map/v1/{id}/{z}/{x}/{y}.png'
            attribution='Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, '
            id='hsl-map'
          />
          <FeatureGroup>
            {this.state.stops.map((stop) => StopService.getLeafletCircle(stop, this.state.viewPosition))}
          </FeatureGroup>
        </Map>
      </div>
    );
  }
}

export default App;
