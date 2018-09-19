import React from "react";
import { StyleSheet, Text, SafeAreaView } from "react-native";
import Map from "./Map";
import { Location, Permissions } from "expo";
import YelpService from "./perry";

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
  state = {
    region: null,
    coffeeShops: []
  };

  componentWillMount() {
    this.getLocationAsync();
  }

  getCoffeeShops = async () => {
    const { latitude, longitude } = this.state.region;
    const userLocation = { latitude, longitude };
    const coffeeShops = await YelpService.getCoffeeShops(userLocation);
    this.setState({ coffeeShops });
  };

  getLocationAsync = async () => {
    let { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status !== "granted") {
      this.setState({
        errorMessage: "Permission to access location was denied"
      });
    }
    let location = await Location.getCurrentPositionAsync().catch((r) => console.log(r));
    const region = {
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
      ...deltas
    };
    await this.setState({ region });
    await this.getCoffeeShops();
  };

  render() {
    return (
      <SafeAreaView style={styles.container}>
        <Map region={region} places={this.state.coffeeShops} />
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center"
  }
});
