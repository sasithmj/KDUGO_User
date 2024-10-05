import React, {useState, useRef} from 'react';
import {
  View,
  StyleSheet,
  Text,
  PanResponder,
  Animated,
  Dimensions,
} from 'react-native';
import Routemap from '../Components/Routemap';
import Bustypes from '../Components/BusTypes/Bustypes';
import RouteTracking from './RouteTracking';
import TrackingTimeline from './TrackingTimeline';

const {height: SCREEN_HEIGHT} = Dimensions.get('window');
const MIN_HEIGHT = SCREEN_HEIGHT * 0.2;
const MAX_HEIGHT = SCREEN_HEIGHT * 0.8;

const SearchResults = () => {
  const [bottomSheetHeight] = useState(new Animated.Value(MIN_HEIGHT));
  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: (_, gestureState) => {
        const newHeight = SCREEN_HEIGHT - gestureState.moveY;
        if (newHeight >= MIN_HEIGHT && newHeight <= MAX_HEIGHT) {
          bottomSheetHeight.setValue(newHeight);
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        const newHeight = SCREEN_HEIGHT - gestureState.moveY;
        let snapHeight;
        if (newHeight < SCREEN_HEIGHT * 0.4) {
          snapHeight = MIN_HEIGHT;
        } else if (newHeight > SCREEN_HEIGHT * 0.6) {
          snapHeight = MAX_HEIGHT;
        } else {
          snapHeight = SCREEN_HEIGHT * 0.5;
        }
        Animated.spring(bottomSheetHeight, {
          toValue: snapHeight,
          useNativeDriver: false,
        }).start();
      },
    }),
  ).current;

  return (
    <View style={styles.container}>
      <View style={styles.mapContainer}>
        <Routemap />
      </View>
      <Animated.View
        style={[
          styles.bottomSheet,
          {
            height: bottomSheetHeight,
            top: Animated.subtract(SCREEN_HEIGHT, bottomSheetHeight),
          },
        ]}
        {...panResponder.panHandlers}>
        <View style={styles.dragHandle} />
        <Text style={styles.bottomSheetTitle}>Bus Details</Text>
        <Bustypes />
        <TrackingTimeline />
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  mapContainer: {
    ...StyleSheet.absoluteFillObject,
  },
  bottomSheet: {
    position: 'absolute',
    left: 0,
    right: 0,
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  dragHandle: {
    width: 40,
    height: 5,
    backgroundColor: '#DDDDDD',
    borderRadius: 3,
    alignSelf: 'center',
    marginBottom: 8,
  },
  bottomSheetTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
});

export default SearchResults;
