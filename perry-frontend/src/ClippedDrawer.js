import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Drawer from "@material-ui/core/Drawer";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import List from "@material-ui/core/List";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import SettingsIcon from "@material-ui/icons/Settings";
import ListSubheader from "@material-ui/core/ListSubheader";
import MapComponent from "./MapComponent";
// import DevicesList from "./DevicesList";
import GpsFixedIcon from "@material-ui/icons/GpsFixed";
const drawerWidth = 240;

const styles = theme => ({
  root: {
    flexGrow: 1,
    //height: 100,
    zIndex: 1,
    overflow: "hidden",
    position: "relative",
    display: "flex"
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1
  },
  drawerPaper: {
    position: "relative",
    width: drawerWidth
  },
  content: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.default,
    //padding: theme.spacing.unit * 3,
    minWidth: 0 // So the Typography noWrap works
  },
  toolbar: theme.mixins.toolbar
});

export class ClippedDrawer extends React.Component {
  constructor() {
    super();
    this.state = {
      markers: [
        { key: "marker1", position: [51.5, -0.1], children: "My first popup" },
        {
          key: "marker2",
          position: [51.51, -0.1],
          children: "My second popup"
        },
        { key: "marker3", position: [51.49, -0.05], children: "My third popup" }
      ]
    };
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

        this.setState({
          markers: this.state.markers,
          devices: devices
        });
        console.log("state", this.state);
      });
  }

  handleClick(id, e) {
    console.log("I've been clicked woo!", id, e);
    fetch("http://localhost:3000/device/" + id + "/path", {
      headers: {
        Token: "jnjrineifnajen"
      }
    })
      .then(results => {
        return results.json();
      })
      .then(data => {
        let newmarkers = data.map(path => {
          return {
            key: path.date,
            position: [path.latitude, path.longitude],
            children: path.device_id
          };
        });
        this.setState({
          markers: newmarkers,
          devices: this.state.devices
        });
        console.log("state", this.state);
      });
    // this.setState({
    //   markers: [
    //     { key: "markerx", position: [51.2, -0.2], children: "My first popup" },
    //     {
    //       key: "markery",
    //       position: [51.0, -0.1],
    //       children: "My second popup"
    //     },
    //     { key: "markerz", position: [51.43, -0.05], children: "My third popup" }
    //   ],
    //   devices: this.state.devices
    // });
  }

  render() {
    const { classes } = this.props;
    return (
      <div className={classes.root}>
        <AppBar position="absolute" className={classes.appBar}>
          <Toolbar>
            <Typography variant="title" color="inherit" noWrap>
              Perry
            </Typography>
          </Toolbar>
        </AppBar>
        <Drawer
          variant="permanent"
          classes={{
            paper: classes.drawerPaper
          }}
        >
          <div className={classes.toolbar} />
          <List>
            <ListItem button>
              <ListItemIcon>
                <SettingsIcon />
              </ListItemIcon>
              <ListItemText primary="Settings" />
            </ListItem>
          </List>
          <Divider />
          <List
            component="nav"
            subheader={<ListSubheader component="div">Devices</ListSubheader>}
          >
            <div>{this.state.devices}</div>
          </List>
        </Drawer>
        <main className={classes.content}>
          <div className={classes.toolbar} />
          <MapComponent markers={this.state.markers} />
        </main>
      </div>
    );
  }
}
ClippedDrawer.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(ClippedDrawer);
