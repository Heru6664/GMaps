import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  TouchableOpacity,
  Platform,
  Image
} from "react-native";
import MapView, {
  PROVIDER_GOOGLE,
  MAP_TYPES,
  Marker,
  AnimatedRegion
} from "react-native-maps";
import marker from "./assets/marker.png";
import Geolocation from "@react-native-community/geolocation";
import LocationServicesDialogBox from "react-native-android-location-services-dialog-box";

export default class App extends Component {
  constructor() {
    super();
    this.state = {
      mapRegion: null,
      lastLat: null,
      lastLong: null,
      selectedPlace: {
        latitude: "",
        longitude: ""
      }
    };
  }

  componentDidMount() {
    LocationServicesDialogBox.checkLocationServicesIsEnabled({
      message:
        "<h2>Use Location ?</h2>This app wants to change your device settings:<br/><br/>Use GPS, Wi-Fi, and cell network for location<br/><br/><a href='#'>Learn more</a>",
      ok: "YES",
      cancel: "NO",
      enableHighAccuracy: true, // true => GPS AND NETWORK PROVIDER, false => GPS OR NETWORK PROVIDER
      showDialog: true, // false => Opens the Location access page directly
      openLocationServices: true, // false => Directly catch method is called if location services are turned off
      preventOutSideTouch: false, //true => To prevent the location services popup from closing when it is clicked outside
      preventBackClick: false, //true => To prevent the location services popup from closing when it is clicked back button
      providerListener: true // true ==> Trigger "locationProviderStatusChange" listener when the location state changes
    })
      .then(() => {
        this.getCurrentPosition();
      })
      .catch(error => {
        console.log(error.message);
      });
  }

  getCurrentPosition = () => {
    Geolocation.getCurrentPosition(
      position => {
        let region = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          latitudeDelta: 0.00922 * 1.5,
          longitudeDelta: 0.00421 * 1.5
        };
        this.onRegionChange(region, region.latitude, region.longitude);
      },
      err => console.log("error", err)
    );
  };

  onRegionChange = (region, lastLat, lastLong) => {
    this.setState({
      mapRegion: region,
      lastLat: lastLat || this.state.lastLat,
      lastLong: lastLong || this.state.lastLong
    });
  };

  setLocation() {
    this.setState({
      selectedPlace: {
        latitude: this.state.mapRegion.latitude,
        longitude: this.state.mapRegion.longitude
      }
    });
  }

  render() {
    return (
      <View style={styles.container}>
        <MapView
          provider={PROVIDER_GOOGLE}
          ref={ref => {
            this.map = ref;
          }}
          style={styles.map}
          initialRegion={this.state.mapRegion}
          onRegionChangeComplete={region =>
            this.onRegionChange(region, region.latitude, region.longitude)
          }
          showsUserLocation={true}
        />
        <View style={styles.markerFixed}>
          <Image style={styles.marker} source={marker} />
        </View>
        {/* <View style={[styles.bubble, styles.latlng]}>
          <Text style={styles.centeredText}>
            {this.state.mapRegion.latitude.toPrecision(7)}
            {",  "}
            {this.state.mapRegion.longitude.toPrecision(7)}
          </Text>
        </View> */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.bubble, styles.button]}
            onPress={() => this.setLocation()}
          >
            <Text style={styles.buttonText}>Animate </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "flex-end",
    alignItems: "center"
  },
  welcome: {
    fontSize: 20,
    textAlign: "center",
    margin: 10
  },
  map: {
    ...StyleSheet.absoluteFillObject
  },
  markerFixed: {
    left: "50%",
    marginLeft: -24,
    marginTop: -48,
    position: "absolute",
    top: "50%"
  },
  bubble: {
    backgroundColor: "rgba(255,255,255,0.7)",
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 20
  },
  marker: {
    height: 48,
    width: 48
  },
  latlng: {
    width: 200,
    alignItems: "stretch"
  },
  centeredText: { textAlign: "center" },
  buttonContainer: {
    flexDirection: "row",
    marginVertical: 20,
    backgroundColor: "transparent"
  },
  button: {
    width: 100,
    paddingHorizontal: 8,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 5
  }
});
