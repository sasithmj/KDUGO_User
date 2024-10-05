import React, {useState, useEffect} from 'react';
import {View, Image, StyleSheet, Text} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const BustypeRow = ({isSaturday}) => {
  const [timeLeft, setTimeLeft] = useState('');

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const departureTime = new Date(now);
      departureTime.setHours(16, 0, 0, 0); // Set to 4:00 PM

      if (now > departureTime) {
        departureTime.setDate(departureTime.getDate() + 1);
      }

      const diff = departureTime - now;
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeLeft(`${hours}H ${minutes}min ${seconds}s`);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <View style={styles.container}>
      <Image
        style={styles.image}
        source={require('../../../assets/imgs/bus.png.jpg')}
      />
      <View style={styles.middleContainer}>
        <Text style={styles.type}>
          Staff KduSC Bus <Ionicons name="person" size={16} />
        </Text>
        <Text style={styles.time}>Departure: 4:00 PM</Text>
        <Text style={styles.location}>
          From: {isSaturday ? 'Campus' : 'Town'}
        </Text>
        <Text style={styles.countdown}>Time left: {timeLeft}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    marginVertical: 10,
  },
  image: {
    width: 70,
    height: 80,
    resizeMode: 'cover',
    borderRadius: 5,
  },
  middleContainer: {
    flex: 1,
    marginLeft: 15,
    justifyContent: 'space-between',
    marginHorizontal: 10,
  },
  type: {
    fontWeight: 'bold',
    fontSize: 18,
    color: '#333',
    marginBottom: 4,
  },
  time: {
    fontSize: 14,
    color: '#666',
  },
  location: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  countdown: {
    fontSize: 20,
    color: 'green',
    marginTop: 4,
    fontWeight: 'bold',
  },
});

export default BustypeRow;
