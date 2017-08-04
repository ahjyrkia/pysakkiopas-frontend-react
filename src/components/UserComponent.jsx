import React from 'react';
import { Circle } from 'react-leaflet';
import config from '../config.jsx';

const UserComponent = (props) => {
  return (
    <Circle
      center={props.coords}
      radius={config.radius[props.zoom]}
      color={config.colors[props.type]}>
    </Circle>
  )
}

export default UserComponent;
