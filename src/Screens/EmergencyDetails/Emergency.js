import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, ScrollView, Linking } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome'; // Make sure this package is installed

const logimg = require("../../../assets/Suwa.png");

const Emergency = () => {
  const callPoliceEmergency = () => {
    Linking.openURL('tel:119'); // Call the number 119 for police emergency
  };

  const fireRescue = () => {
    Linking.openURL('tel:110'); // Call the number 110 for fire rescue
  }
  const southern = () => {
    Linking.openURL('tel:1969'); // Call the number 112 for southern emergency
  }

  const goverment =() => {
    Linking.openURL('tel:1919');
  }

  const exchange =() => {
    Linking.openURL('tel:+94472030800');
  }
  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Top Image */}
      <Image
        source={logimg}
        style={styles.image}
      />

      {/* Emergency Buttons */}
      <TouchableOpacity style={styles.button} onPress={callPoliceEmergency}>
        <Icon name="car" size={24} color="white" />
        <Text style={styles.buttonText}>POLICE EMERGENCY HOTLINE</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={fireRescue}>
        <Icon name="ambulance" size={24} color="white" />
        <Text style={styles.buttonText}>AMBULANCE / FIRE & RESCUE</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={southern}>
        <Icon name="road" size={24} color="white" />
        <Text style={styles.buttonText}>SOUTHERN EXPRESSWAY EMERGENCY</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={goverment}>
        <Icon name="info-circle" size={24} color="white" />
        <Text style={styles.buttonText}>GOVERNMENT INFORMATION CENTER</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={exchange}>
        <Icon name="phone" size={24} color="white" />
        <Text style={styles.buttonText}>KDUSC EXCHANGE</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    alignItems: 'center',
    backgroundColor: '#F8F8F8', // Light background color
  },
  image: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
    marginBottom: 20,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'black',
    padding: 15,
    marginVertical: 8,
    borderRadius: 8,
    width: '100%',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    marginLeft: 10,
  },
});

export default Emergency;
