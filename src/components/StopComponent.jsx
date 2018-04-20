import React, { Component } from 'react';
import { Circle, Popup } from 'react-leaflet';
import config from '../config.jsx';
import stopService from '../services/stopService.jsx';

import '../css/spinner.css';
import '../css/popup.css';

class StopComponent extends Component {
  constructor(props) {
    super(props)
    this.state = {
      contentExists: false,
      name: null,
      address: null,
      code: null,
      timetableLink: null,
      departures: [],
      lines: []
    }
    this.generatePopupContent = this.generatePopupContent.bind(this);
    this.getStopData = this.getStopData.bind(this);
    this.parseTimetableRow = this.parseTimetableRow.bind(this);
  }

  generatePopupContent() {
    if (!this.state.contentExists) {
      return (
        <div className="spinner">
          <div className="double-bounce1" />
          <div className="double-bounce2" />
        </div>
      )
    } else {
      return (
        <div className="popupContent">
          <span>
            <b className="name">
              {this.state.name + " "}
              <a target={"_blank"} href={this.state.timetableLink}>
                {this.state.code}
              </a>
            </b>
          </span>
            <p className="address">
              {this.state.address}
            </p>
          <span className="timetable">
            {this.state.departures.map((departure, index) => {
              return (
                <span key={index}>
                  <br/>
                  {this.parseTimetableRow(departure)}
                </span>
              )
            })}
          </span>
        </div>
      )
    }
  }

  parseTimetableRow(departure) {
    //TODO
    //this is garbage that should be burned when backend is updated

    var time = departure.time;
    if (time >= 2400) time = time-2400;
    var time = ""+time;
    if (time.length === 3) {
      time = " " + time;
    }
    time = time.substr(0,2)+"."+time.substr(2,3);
    var code = departure.code.split("  ")[0];
    var type = "bus";
    var destination;
    this.state.lines.map((line) => {
      if (line.includes(departure.code)) {
        destination = line.split(departure.code+":")[1];
      }
    })
    var parsedCode;
    if (code.substr(0,2) === "10" && code.substr(0,3) !== "100") {
      parsedCode = code.substr(2,)
    }
    if (code.substr(1,1) !== "0") {
      parsedCode = code.substr(1,)
    }
    if (code.substr(0,3) === "100") {
      parsedCode = code.substr(3,).split(" ")[0];
      type = "tram";
    }
    if (code.substr(0,4) === "1010") {
      parsedCode = code.substr(2,).split(" ")[0];
      type = "tram";
    }
    return (<b>{time + " "}<b className={type}>{parsedCode}</b><b className="destination">{" "+destination}</b></b>)
  }

  getStopData(e, code) {
    stopService.fetchStopData(code).then((response) => {
      this.props.map.panTo(e.latlng);
      if (!response) {
      } else {
        this.setState({
          contentExists: true,
          name: response[0].name_fi,
          address: response[0].address_fi,
          code: response[0].code_short,
          timetableLink: response[0].timetable_link,
          departures: response[0].departures,
          lines: response[0].lines
        })
      }
    }).catch((error) => {
      console.log(error)
    })
  }

  render() {
    return (
      <Circle
        center={this.props.coords}
        radius={config.radius[this.props.zoom]}
        color={config.colors[this.props.type]}
        onClick={(e) => {this.getStopData(e, this.props.code)}}
        >
        <Popup
          keepInView={false}
          autoPan={false}
          minWidth={"auto"}>
          {this.generatePopupContent()}
        </Popup>
      </Circle>
    )
  }
}

export default StopComponent;
