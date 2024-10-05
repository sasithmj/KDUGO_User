import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo';

const PlaceRow = ({data}) => {
    console.log(data)
  return (
    <View style={styles.row}>
      <View style={styles.iconContainer}>
        {data.description === 'Home' 
        ? <Entypo name="home" size={30} color="white" />
        : <Entypo name="location-pin" size={30} color="white" />
        }
        
      </View>
      <Text style={styles.text}>{data.description || data.vicinity}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#f8f8f8',
    marginVertical: 10,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  iconContainer: {
    backgroundColor: 'grey',
    padding: 10,
    borderRadius: 50,
    marginRight: 15,
  },
  text: {
    fontSize: 15,
    color: '#333',
  },
 
});

export default PlaceRow;
