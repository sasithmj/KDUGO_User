import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native'; // You can use other icon libraries as well.

const Details = () => {
  const navigation = useNavigation();
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerText}>Details</Text>
        <TouchableOpacity>
          <Icon name="information-outline" size={24} color="black" />
        </TouchableOpacity>
      </View>

      {/* Button List */}
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('TimeShedule')}>
        <Icon name="clock-outline" size={24} color="white" />
        <Text style={styles.buttonText}>Time Schedule</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('TicketPrices')}>
        <Icon name="ticket-outline" size={24} color="white" />
        <Text style={styles.buttonText}>Ticket Prices</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button}  onPress={() => navigation.navigate('DriverDetails')}>
        <Icon name="account-outline" size={24} color="white" />
        <Text style={styles.buttonText}>Driver Details</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button}  onPress={() => navigation.navigate('BusDetails')}>
        <Icon name="bus" size={24} color="white" />
        <Text style={styles.buttonText}>Bus Details</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FF9800', // Use your header background color
    padding: 10,
  },
  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#212121',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginVertical: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    marginLeft: 15,
  },
});

export default Details;
