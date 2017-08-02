import React from 'react';
import {Circle, Popup} from 'react-leaflet';

const colors = {
  "3": "blue"
}

const getLeafletCircle = (json, viewCoords) => {
    var coords = json.coords.split(',');
    var latDif = Math.abs(coords[0]-viewCoords[0]);
    var lngDif = Math.abs(coords[1]-viewCoords[1]);
    if (latDif > 0.015 || lngDif > 0.03) {
      return;
    }
    return (
      <Circle
        key={json.code}
        center={[parseFloat(coords[0]),parseFloat(coords[1])]}
        radius={4}
        color={colors[json.type]}>
        <Popup>
          <span>popup</span>
        </Popup>
      </Circle>
    )
}

export default { getLeafletCircle };
