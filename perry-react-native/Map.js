import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { MapView } from 'expo';

const Marker = MapView.Marker

export default class Map extends Component {
  renderMarkers() {
    console.log("Places: ", this.props);
    return this.props.places.map((place, i) => {
      let pin = place.children + " on " + place.name;
      return (
      <Marker key={i} title={pin} coordinate={{latitude: place.coords[0], longitude: place.coords[1]}} />
    )});
  }
  
  render() {
    const { region } = this.props
    const markers = this.renderMarkers();
    return (
      <MapView
        style={styles.container}
        region={region}
        showsUserLocation
        showsMyLocationButton
      >
        {markers}
      </MapView>
    )
  }
}
const styles = {
  container: {
    width: '100%',
    height: '80%',
  }
}