import React from "react";
import {
  DrawerLayoutAndroid,
  StyleSheet,
  Text,
  SafeAreaView,
  View,
  Dimensions
} from "react-native";
import Map from "./Map";
import { Location, Permissions } from "expo";
import ApiService from "./perry";
import { Constants } from "expo";
import { List, ListItem, Header } from "react-native-elements"; // 0.16.0
import "@expo/vector-icons"; // 5.2.0

const deltas = {
  latitudeDelta: 0.0922,
  longitudeDelta: 0.0421
};

// A placeholder until we get our own location
const region = {
  latitude: 37.321996988,
  longitude: -122.0325472123455,
  latitudeDelta: 0.0922,
  longitudeDelta: 0.0421
};

export default class App extends React.Component {
  constructor() {
    super();
    //this.openDrawer = this.openDrawer.bind(this);
  }

  openDrawer = () => {
    this.drawer.openDrawer();
  };

  state = {
    devices: [],
    region: null,
    coffeeShops: []
  };

  componentDidMount() {
    this.getLocationAsync();
    this.getDevices();
  }

  getDevicePath = async deviceName => {
    const { latitude, longitude } = this.state.region;
    const userLocation = { latitude, longitude };
    const coffeeShops = await ApiService.getDevicePath(deviceName);
    this.setState({ coffeeShops });
  };

  getDevices = async () => {
    const devices = await ApiService.getDeviceList(this.getDevicePath);
    console.log("dev: ", devices);
    this.setState({ devices });
    console.log("State: ", this.state);
  };

  getLocationAsync = async () => {
    let { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status !== "granted") {
      this.setState({
        errorMessage: "Permission to access location was denied"
      });
    }
    let location = await Location.getCurrentPositionAsync().catch(r =>
      console.log(r)
    );
    const region = {
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
      ...deltas
    };
    await this.setState({ region });
    //  await this.getDevicePath();
    //await this.getDevices();
  };

  render() {
    let devices = this.state.devices.map(device => (
      <ListItem
        key={device.name}
        title={device.name}
        leftIcon={{ name: "devices" }}
        onPress={() => {
          this.getDevicePath(device.name);
        }}
      />
    ));
    let navigationView = (
      <View
        style={{
          flex: 1,
          backgroundColor: "#fff",
          paddingTop: Constants.statusBarHeight
        }}
      >
        <List>{devices}</List>
      </View>
    );
    //

    /*
    onPress: {this.refs["DRAWER"].openDrawer()}
    */
    return (
      <DrawerLayoutAndroid
        drawerWidth={200}
        drawerPosition={DrawerLayoutAndroid.positions.Left}
        renderNavigationView={() => navigationView}
        ref={_drawer => (this.drawer = _drawer)}
        style={styles.container}
      >
        <Header
          leftComponent={{
            icon: "devices",
            color: "#fff",
            onPress: this.openDrawer
          }}
          centerComponent={{ text: "Perry", style: { color: "#fff" } }}
          backgroundColor="teal"
        />
        <Map
          style={{ height: 50 }}
          region={region}
          places={this.state.coffeeShops}
        />
      </DrawerLayoutAndroid>
    );
  }
}

const styles = StyleSheet.create({
  container: {}
});
