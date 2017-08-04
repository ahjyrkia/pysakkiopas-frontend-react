
const isWithinViewDistance = (coords, viewCoords, zoom) => {
  var latDif = Math.abs(coords[0]-viewCoords[0]);
  var lngDif = Math.abs(coords[1]-viewCoords[1]);
  if (latDif > 0.015 || lngDif > 0.03) {
    return false;
  }
  return true;
}

const fetchStopData = (code) => {
  return fetch('https://pysakkiopas-backend.herokuapp.com/stop/'+code)
    .then((response) => response.json())
    .then((responseJson) => {
      return responseJson;
    })
    .catch((error) => {
      console.error(error);
  });
}

const fetchStopsData = () => {
  return fetch('https://pysakkiopas-backend.herokuapp.com/stop')
    .then((response) => response.json())
    .then((responseJson) => {
      return responseJson;
    })
    .catch((error) => {
      console.error(error);
  });
}
export default { isWithinViewDistance, fetchStopData, fetchStopsData };
