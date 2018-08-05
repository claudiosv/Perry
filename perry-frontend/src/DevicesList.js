import React from "react";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import GpsFixedIcon from "@material-ui/icons/GpsFixed";

export default class DevicesList extends React.Component {
  constructor() {
    super();
    this.state = {};
    this.handleClick = this.handleClick.bind(this);
  }

  componentDidMount() {
    fetch("http://localhost:3000/devices", {
      headers: {
        Token: "jnjrineifnajen"
      }
    })
      .then(results => {
        return results.json();
      })
      .then(data => {
        let devices = data.map(device => {
          return (
            <ListItem
              button
              key={device.topic}
              onClick={e => this.handleClick(device.topic, e)}
            >
              <ListItemIcon>
                <GpsFixedIcon />
              </ListItemIcon>
              <ListItemText primary={device.topic} />
            </ListItem>
          );
        });

        this.setState({ devices: devices });
        console.log("state", this.state);
      });
  }

  handleClick(id, e) {
    console.log("I've been clicked woo!", id, e);
  }

  render() {
    return <div>{this.state.devices}</div>;
  }
}
