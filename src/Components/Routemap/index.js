import React, {useEffect, useRef, useState} from 'react';
import {View, StyleSheet, Image} from 'react-native';
import MapView, {
  PROVIDER_GOOGLE,
  Marker,
  AnimatedRegion,
} from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import {doc, onSnapshot} from 'firebase/firestore';
import {db} from '../../../firebase'; // Make sure to import your Firebase config

const GOOGLE_MAPS_APIKEY = 'AIzaSyB8SDuL-vEKer19D3XBIrNmO8-uuYN_mkI';

const Routemap = () => {
  const mapRef = useRef(null);
  const [routeCoordinates, setRouteCoordinates] = useState([]);
  const [isTracking, setIsTracking] = useState(false);
  const [busAnimatedLocation] = useState(
    new AnimatedRegion({
      latitude: 6.799194892747798,
      longitude: 79.9799469907597,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    }),
  );

  const origin = {
    latitude: 6.799194892747798,
    longitude: 79.9799469907597,
  };

  const destination = {
    latitude: 6.2710215329666,
    longitude: 81.00946382083058,
  };

  // Helper function to animate the bus marker smoothly
  const animateBusLocation = newLocation => {
    const newCoordinate = {
      latitude: newLocation.latitude,
      longitude: newLocation.longitude,
    };

    if (Platform.OS === 'android') {
      if (busAnimatedLocation) {
        busAnimatedLocation
          .timing({
            latitude: newCoordinate.latitude,
            longitude: newCoordinate.longitude,
            duration: 5000, // duration of animation
          })
          .start();
      }
    } else {
      busAnimatedLocation.timing(newCoordinate).start(); // for iOS
    }
  };

  useEffect(() => {
    const unsubscribe = onSnapshot(
      doc(db, 'busLocation', 'currentLocation'),
      doc => {
        if (doc.exists()) {
          const data = doc.data();
          const newBusLocation = {
            latitude: data.latitude,
            longitude: data.longitude,
          };

          animateBusLocation(newBusLocation); // Call to animate the marker
          setIsTracking(data.isTracking);
        }
      },
    );

    return () => unsubscribe();
  }, []);

  const onRouteReady = result => {
    setRouteCoordinates(result.coordinates);

    mapRef.current.fitToCoordinates(result.coordinates, {
      edgePadding: {top: 50, right: 50, bottom: 50, left: 50},
      animated: true,
    });
  };

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        initialRegion={{
          latitude: 6.799194892747798,
          longitude: 79.9799469907597,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
        scrollEnabled={true}>
        <MapViewDirections
          origin={origin}
          destination={destination}
          apikey={GOOGLE_MAPS_APIKEY}
          strokeWidth={4}
          strokeColor="blue"
          onReady={onRouteReady}
        />
        <Marker coordinate={origin} title={'Origin'} />
        <Marker coordinate={destination} title={'Destination'} />
        {isTracking && (
          <Marker.Animated coordinate={busAnimatedLocation} title={'Bus'}>
            <Image
              source={require('../../../assets/bus-icon.png')}
              style={styles.busIcon}
            />
          </Marker.Animated>
        )}
      </MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  busIcon: {
    width: 40,
    height: 40,
    resizeMode: 'contain',
  },
});

export default Routemap;
