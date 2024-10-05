import React, {useState, useEffect} from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  Alert,
  ScrollView,
  TouchableOpacity,
  Switch,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {doc, setDoc, getDoc, getDocs, collection} from 'firebase/firestore';
import {db} from '../../../firebase';
import {useNavigation, useRoute} from '@react-navigation/native';
import {Picker} from '@react-native-picker/picker';

export default function BookRegistration() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [destination, setDestination] = useState('');
  const [journeyType, setJourneyType] = useState('');
  const [travelDate, setTravelDate] = useState(new Date());
  const [reserveTuesday, setReserveTuesday] = useState(false);
  const [upcomingTuesday, setUpcomingTuesday] = useState(null);
  const [interchanges, setInterchanges] = useState([]);

  const route = useRoute();
  const navigation = useNavigation();
  const {seatNumber, seatId, date} = route.params;

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const savedEmail = await AsyncStorage.getItem('userEmail');
        if (savedEmail) {
          setEmail(savedEmail);
          const userDocRef = doc(db, 'userdata', savedEmail);
          const userDoc = await getDoc(userDocRef);
          if (userDoc.exists()) {
            const userData = userDoc.data();
            setFullName(userData.fullName);
            setPhoneNumber(userData.phoneNumber);
          } else {
            console.log('No user data found in Firebase');
          }
        }
      } catch (error) {
        console.log('Error fetching user data:', error);
      }
    };

    fetchUserData();
    fetchInterchangeData();
  }, []);

  useEffect(() => {
    const travelDay = new Date(date).getDay();
    if (travelDay === 6) {
      setJourneyType('fromCampus'); // Saturday
      // Calculate the upcoming Tuesday
      const tuesday = new Date(date);
      tuesday.setDate(tuesday.getDate() + ((2 + 7 - tuesday.getDay()) % 7));
      setUpcomingTuesday(tuesday);
    } else if (travelDay === 2) {
      setJourneyType('toCampus'); // Tuesday
    } else {
      Alert.alert('Error', 'Please select either a Tuesday or Saturday.');
      navigation.goBack();
    }
  }, [date, navigation]);

  const fetchInterchangeData = async () => {
    try {
      const ticketPricesCollection = collection(db, 'ticketPrices');
      const querySnapshot = await getDocs(ticketPricesCollection);
      const interchangeData = querySnapshot.docs.map(
        doc => doc.data().exitName,
      );
      setInterchanges(interchangeData);
    } catch (error) {
      console.log('Error fetching interchange data:', error);
      Alert.alert(
        'Error',
        'Failed to fetch destination options. Please try again.',
      );
    }
  };

  async function submitBooking() {
    if (!fullName || !email || !phoneNumber || !destination) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    try {
      // Book for the selected date
      await setDoc(
        doc(
          db,
          'reservations',
          `${email}_${seatId}_${date.toISOString().split('T')[0]}`,
        ),
        {
          fullName,
          email,
          phoneNumber,
          journeyType,
          destination,
          travelDate: date,
          seatId,
          seat_state: true,
        },
      );

      // If it's Saturday and user wants to reserve for Tuesday
      if (journeyType === 'fromCampus' && reserveTuesday && upcomingTuesday) {
        await setDoc(
          doc(
            db,
            'reservations',
            `${email}_${seatId}_${upcomingTuesday.toISOString().split('T')[0]}`,
          ),
          {
            fullName,
            email,
            phoneNumber,
            journeyType: 'toCampus',
            destination,
            travelDate: upcomingTuesday,
            seatId,
            seat_state: true,
          },
        );
      }

      Alert.alert('Success', 'Your seat(s) have been booked successfully');
      navigation.navigate('BookSeats', {refreshSeats: true});
    } catch (error) {
      console.log('Error submitting data:', error);
      Alert.alert('Error', 'Failed to book the seat. Please try again.');
    }
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Book Your Seat</Text>
      <Text style={styles.seatInfo}>Seat Number: {seatNumber}</Text>
      <Text style={styles.seatInfo}>{date.toISOString().split('T')[0]}</Text>

      <TextInput
        value={fullName}
        placeholder="Full Name"
        style={styles.input}
        editable={false}
      />

      <TextInput
        value={email}
        placeholder="Email"
        style={styles.input}
        keyboardType="email-address"
        editable={false}
      />

      <TextInput
        value={phoneNumber}
        placeholder="Phone Number"
        style={styles.input}
        keyboardType="phone-pad"
        editable={false}
      />

      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={destination}
          onValueChange={itemValue => setDestination(itemValue)}
          style={styles.picker}>
          <Picker.Item label="Select a destination" value="" />
          {interchanges.map((interchange, index) => (
            <Picker.Item key={index} label={interchange} value={interchange} />
          ))}
        </Picker>
      </View>

      <Text style={styles.dateInfo}>
        {journeyType === 'fromCampus'
          ? 'This journey is From Campus (Saturday)'
          : 'This journey is To Campus (Tuesday)'}
      </Text>

      {journeyType === 'fromCampus' && (
        <View style={styles.switchContainer}>
          <Text style={styles.highlightedText}>
            Reserve for upcoming Tuesday?
          </Text>
          <Switch
            value={reserveTuesday}
            onValueChange={setReserveTuesday}
            trackColor={{false: '#767577', true: '#81b0ff'}}
            thumbColor={reserveTuesday ? '#ff8c52' : '#f4f3f4'}
          />
        </View>
      )}

      {reserveTuesday && upcomingTuesday && (
        <Text style={styles.upcomingTuesdayInfo}>
          Upcoming Tuesday: {upcomingTuesday.toISOString().split('T')[0]}
        </Text>
      )}

      <TouchableOpacity style={styles.submitButton} onPress={submitBooking}>
        <Text style={styles.submitButtonText}>Book Seat</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#333',
  },
  info: {
    fontSize: 16,
    marginBottom: 15,
    color: '#666',
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    marginBottom: 15,
    backgroundColor: '#fff',
  },
  picker: {
    height: 50,
    width: '100%',
  },
  container: {
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  seatInfo: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: 'center',
    color: '#666',
  },
  input: {
    height: 50,
    borderColor: '#ddd',
    borderWidth: 1,
    marginBottom: 15,
    paddingLeft: 15,
    borderRadius: 8,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  dateInfo: {
    fontSize: 14,
    color: '#666',
    marginTop: -10,
    marginBottom: 15,
    textAlign: 'center',
  },
  submitButton: {
    backgroundColor: '#ff8c52',
    padding: 15,
    borderRadius: 8,
    marginTop: 10,
  },
  submitButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
    backgroundColor: '#e6f7ff', // Light blue background
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#91d5ff', // Slightly darker blue border
  },
  highlightedText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0050b3', // Dark blue text
    flex: 1, // Take up available space
    marginRight: 10, // Add some space between text and switch
  },
  upcomingTuesdayInfo: {
    fontSize: 14,
    color: '#666',
    marginBottom: 15,
    textAlign: 'center',
    fontStyle: 'italic',
  },
});
