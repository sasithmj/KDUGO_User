import React from "react";
import { View, StyleSheet, Image } from "react-native";
import MapView, { PROVIDER_GOOGLE, Marker } from "react-native-maps";

const HomeMap = (props) => {
  const heading = 47; // Define the heading here

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        showsUserLocation = {true}
        initialRegion={{
          latitude: 37.78825,
          longitude: -122.4324,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
        scrollEnabled={true} // Enable scrolling on the map
      >
        <Marker coordinate={{ latitude: 37.78825, longitude: -122.4324 }}>
          <Image
            source={require("../../../assets/imgs/top-UberX.png")}
            style={[styles.markerImage, { transform: [{ rotate: `${heading}deg` }] }]}
          />
        </Marker>
      </MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    flex: 1, // Makes the view fill the entire screen
    backgroundColor: "black",
    justifyContent: "center",
    alignItems: "center",
  },
  map: {
    ...StyleSheet.absoluteFillObject, // Fill the entire container
  },
  markerImage: {
    width: 90, // Set the width of the image
    height: 90, // Set the height of the image
    resizeMode: "contain", // Ensures the image is not stretched
  },
});

export default HomeMap;
