import React, { Component } from "react";
import { Map, TileLayer, Marker, Popup } from "react-leaflet";

const MyPopupMarker = ({ children, position }) => (
  <Marker position={position}>
    <Popup>{children}</Popup>
  </Marker>
);

const MyMarkersList = ({ markers }) => {
  const items = markers.map(({ key, ...props }) => (
    <MyPopupMarker key={key} {...props} />
  ));
  return <div style={{ display: "none" }}>{items}</div>;
};

export default class MapComponent extends Component {
  state = {
    lat: 51.505,
    lng: -0.09,
    zoom: 13
  };
  // constructor(props) {
  // super(props);
  // }

  render() {
    const center = [this.state.lat, this.state.lng];
    console.log(this.props);
    return (
      <Map center={center} zoom={this.state.zoom} id="mapid">
        <TileLayer
          attribution="&amp;copy <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MyMarkersList markers={this.props.markers} />
      </Map>
    );
  }
}
