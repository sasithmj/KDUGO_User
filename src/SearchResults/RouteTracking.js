import React from 'react';
import {View, Text, StyleSheet, ScrollView} from 'react-native';

const interchanges = [
  {name: 'Kahathuduwa Interchange', distance: 5.9},
  {name: 'Gelanigama Interchange', distance: 13.7},
  {name: 'Dodangoda Interchange', distance: 34.8},
  {name: 'Welipenna Interchange', distance: 46.0},
  {name: 'Kurudugahahethekma Interchange', distance: 67.6},
  {name: 'Baddegama Interchange', distance: 79.8},
  {name: 'Pinnaduwa Interchange', distance: 95.3},
  {name: 'Imaduwa Interchange', distance: 107.5},
  {name: 'Kokmaduwa Interchange', distance: 115.2},
  {name: 'Godagama Interchange', distance: 126.2},
  {name: 'Godagama - Palatuwa Interchange', distance: 126.2},
  {name: 'Kapuduwa Interchange', distance: null},
  {name: 'Aparekka Interchange', distance: 136},
  {name: 'Beliatta Interchange', distance: 151},
  {name: 'Bedigama Interchange', distance: null},
  {name: 'Kasagala Interchange', distance: 164},
  {name: 'Angunukolapelessa Interchange', distance: 173},
  {name: 'Barawakubuka Interchange', distance: 181},
  {name: 'Sooriyawewa Interchange', distance: 191},
];

const RouteTracking = () => {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Route Tracking</Text>
      {interchanges.map((interchange, index) => (
        <View key={index} style={styles.interchangeItem}>
          <View style={styles.dot} />
          <View style={styles.interchangeInfo}>
            <Text style={styles.interchangeName}>{interchange.name}</Text>
            {interchange.distance !== null && (
              <Text style={styles.interchangeDistance}>
                {interchange.distance} km
              </Text>
            )}
          </View>
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  interchangeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#007AFF',
    marginRight: 10,
  },
  interchangeInfo: {
    flex: 1,
  },
  interchangeName: {
    fontSize: 16,
    fontWeight: '500',
  },
  interchangeDistance: {
    fontSize: 14,
    color: '#666',
  },
});

export default RouteTracking;
