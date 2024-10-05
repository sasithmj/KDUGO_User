import React, {useState} from 'react';
import {View, Text, StyleSheet, Alert} from 'react-native';
import {RNCamera} from 'react-native-camera';
import QRCodeScanner from 'react-native-qrcode-scanner';
import AsyncStorage from '@react-native-async-storage/async-storage';
import firestore from '@react-native-firebase/firestore';
import LottieView from 'lottie-react-native';

const QRScanner = () => {
  const [scanned, setScanned] = useState(false);
  const [bookingDetails, setBookingDetails] = useState(null);
  const expectedBusId = 'YcqA0RNxsa';

  const processQRCode = async data => {
    setScanned(true);

    console.log('Scanned data:', data);

    const scannedBusId = data.split(':')[1];

    if (scannedBusId !== expectedBusId) {
      Alert.alert(
        'Invalid Bus',
        'The scanned QR code does not match the expected bus.',
      );
      setScanned(false);
      return;
    }

    const userEmail = await AsyncStorage.getItem('userEmail');

    // Get the start and end of the current day
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);
    const startOfDay = firestore.Timestamp.fromDate(currentDate);
    const endOfDay = firestore.Timestamp.fromDate(
      new Date(currentDate.getTime() + 24 * 60 * 60 * 1000),
    );

    try {
      const bookingQuery = firestore()
        .collection('reservations')
        .where('email', '==', userEmail)
        .where('travelDate', '>=', startOfDay)
        .where('travelDate', '<', endOfDay)
        .limit(1);

      const bookingSnapshot = await bookingQuery.get();

      if (!bookingSnapshot.empty) {
        const bookingDoc = bookingSnapshot.docs[0];
        await firestore()
          .collection('reservations')
          .doc(bookingDoc.id)
          .update({checked: true});
        setBookingDetails(bookingDoc.data());
      } else {
        Alert.alert(
          'No Booking Found',
          "You don't have a booking for this bus today.",
        );
      }
    } catch (error) {
      console.error('Error updating booking: ', error);
      Alert.alert('Error', 'Failed to process the QR code. Please try again.');
    } finally {
      setTimeout(() => setScanned(false), 5000);
    }
  };

  const onSuccess = e => {
    processQRCode(e.data);
  };

  return (
    <View style={styles.container}>
      <QRCodeScanner
        onRead={onSuccess}
        flashMode={RNCamera.Constants.FlashMode.auto}
        topContent={
          <Text style={styles.centerText}>Scan the QR code to check in.</Text>
        }
        bottomContent={
          scanned ? (
            bookingDetails ? (
              <View style={styles.bookingInfo}>
                <LottieView
                  source={require('../../../assets/check-animation.json')}
                  autoPlay
                  loop={false}
                  style={styles.checkAnimation}
                />
                <Text style={styles.bookingText}>Booking Confirmed!</Text>
                <Text>Destination: {bookingDetails.destination}</Text>
                <Text>Seat: {bookingDetails.seatId}</Text>
                <Text>Journey Type: {bookingDetails.journeyType}</Text>
              </View>
            ) : (
              <Text style={styles.centerText}>Processing...</Text>
            )
          ) : (
            <Text style={styles.centerText}>Ready to scan</Text>
          )
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: 'white',
  },
  centerText: {
    flex: 1,
    fontSize: 18,
    padding: 32,
    color: '#777',
    fontWeight: 'bold',
  },
  bookingInfo: {
    alignItems: 'center',
    padding: 20,
  },
  bookingText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  checkAnimation: {
    width: 100,
    height: 100,
  },
});

export default QRScanner;
