// App.js
import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  PermissionsAndroid,
  Platform,
} from 'react-native';
import React, {useEffect} from 'react';
import {colors} from './src/global/styles';
import RootNavigation from './src/navigation/RootNavigation';
import PaymentScreen from './src/Components/BookSeats/PaymentScreen';
import {StripeProvider} from '@stripe/stripe-react-native';


// import HomeSearch from './src/Components/HomeSearch/HomeSearch';
// import DestinationSearch from './src/DestinationSearch/DestinationSearch';

export default function App() {
  const androidPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Location Permission',
          message: 'This app needs access to your location.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('You can use the location');
      } else {
        console.log('Location Permission Denied');
      }
    } catch (err) {
      console.warn(err);
    }
  };

  useEffect(() => {
    if (Platform.OS === 'android') {
      androidPermission();
    }
  }, []);

  return (
    <View style={styles.container}>
      <StripeProvider publishableKey="pk_test_51PrYcXLTXy6ka4zMB9elONcT6JCmOx76tIIZCQawCyGzxGcUL0fPzHTP1PdWzX9zVtRL6xtXP6Dd2fYDSwWQlQyI00ibROWHY5">
        {/* <PaymentScreen /> */}
      </StripeProvider>
      <StatusBar barStyle="light-content" backgroundColor={colors.StatusBar} />
      <RootNavigation />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1},
});
