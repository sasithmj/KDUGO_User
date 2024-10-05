import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {Icon} from 'react-native-elements';
import {db} from '../../../firebase';
import {
  collection,
  query,
  where,
  getDocs,
  deleteDoc,
  doc,
} from 'firebase/firestore';

const ReservationHistoryScreen = ({route}) => {
  const [bookings, setBookings] = useState([]);
  const [loadingBookings, setLoadingBookings] = useState(true);
  const navigation = useNavigation();
  const {userEmail} = route.params;

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    setLoadingBookings(true);
    try {
      const q = query(
        collection(db, 'reservations'),
        where('email', '==', userEmail),
      );
      const querySnapshot = await getDocs(q);
      const bookingsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setBookings(bookingsData);
    } catch (error) {
      console.log('Error fetching bookings:', error);
      Alert.alert('Error', 'Failed to fetch bookings');
    } finally {
      setLoadingBookings(false);
    }
  };

  const handleCancelBooking = async bookingId => {
    try {
      await deleteDoc(doc(db, 'reservations', bookingId));
      Alert.alert('Success', 'Booking cancelled successfully');
      fetchBookings(); // Refresh the bookings list
    } catch (error) {
      console.error('Error cancelling booking:', error);
      Alert.alert('Error', 'Failed to cancel booking');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" type="feather" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Reservation History</Text>
      </View>

      {loadingBookings ? (
        <ActivityIndicator size="large" color="#ff8c52" style={styles.loader} />
      ) : (
        <View style={styles.bookingsContainer}>
          {bookings.length > 0 ? (
            bookings.map(booking => (
              <View key={booking.id} style={styles.bookingItem}>
                <Text style={styles.bookingText}>
                  Date: {booking.travelDate.toDate().toLocaleDateString()}
                </Text>
                <Text style={styles.bookingText}>
                  Destination: {booking.destination}
                </Text>
                <Text style={styles.bookingText}>Seat: {booking.seatId}</Text>
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={() => handleCancelBooking(booking.id)}>
                  <Text style={styles.cancelButtonText}>Cancel Booking</Text>
                </TouchableOpacity>
              </View>
            ))
          ) : (
            <Text style={styles.noBookingsText}>No reservations found.</Text>
          )}
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 20,
  },
  loader: {
    marginTop: 50,
  },
  bookingsContainer: {
    padding: 20,
  },
  bookingItem: {
    backgroundColor: '#f8f8f8',
    padding: 15,
    borderRadius: 5,
    marginBottom: 10,
  },
  bookingText: {
    fontSize: 14,
    marginBottom: 5,
  },
  cancelButton: {
    backgroundColor: '#ff4d4d',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  cancelButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  noBookingsText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
  },
});

export default ReservationHistoryScreen;
