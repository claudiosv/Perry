import React, { Component } from "react";
import { Map, TileLayer, Marker, Popup } from "react-leaflet";
import { CardMedia } from "@material-ui/core";

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
    zoom: 15
  };
  // constructor(props) {
  //   super(props);
  // }

  componentDidMount() {}

  render() {
    const average_x = arr =>
      arr.reduce((acc, c) => acc + c.position[0], 0) / arr.length;
    const average_y = arr =>
      arr.reduce((acc, c) => acc + c.position[1], 0) / arr.length;

    let avg_x = average_x(this.props.markers);
    let avg_y = average_y(this.props.markers);
    if (isNaN(avg_x)) avg_x = 40.7127;
    if (isNaN(avg_y)) avg_y = -74.0059;
    console.log();
    const center = [avg_x, avg_y];
    // TODO: Make 64px a prop so that this can responsively render
    const { offsetTop } = this.props;
    return (
      <Map
        center={center}
        zoom={this.state.zoom}
        id="mapid"
        style={{ height: `calc(100% - ${offsetTop}px)` }}
      >
        <TileLayer
          attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MyMarkersList markers={this.props.markers} />
      </Map>
    );
  }
}
