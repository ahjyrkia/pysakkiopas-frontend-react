import React, { Component } from 'react';
import MapComponent from './components/MapComponent.jsx';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      height: window.innerHeight
    }
    this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
  }

  componentDidMount() {
    this.updateWindowDimensions();
    window.addEventListener('resize', this.updateWindowDimensions)
  }

  updateWindowDimensions() {
    this.setState({
      height: window.innerHeight
    })
  }

  render() {
    return (
      <div className="App">
        <MapComponent
          viewPosition={this.state.viewPosition}
          height={this.state.height}
        />
      </div>
    );
  }
}

export default App;
