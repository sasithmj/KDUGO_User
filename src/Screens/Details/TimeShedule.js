import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

const TimeShedule = () => {
  // Data for the schedule rows
  const scheduleData = [
    'Barawakubuka Interchange',
    'Angunkolapelessa Interchange',
    'Kasagala Interchange',
    'Bedigama Interchange',
    'Beliatta Interchange',
    'Aparekka Interchange',
    'Kapuduwe Interchange',
    'Godagama-Palatuwa Interchange',
    'Godagama Interchange',
    'Kokmaduwa Interchange',
    'Imaduwa Interchange',
    'Pinnaduwa Interchange',
    'Baddegama Interchange',
    'Kurrudugahahetekma Interchange',
    'Welipeenna Interchange',
    'Dodangoda Interchange',
    'Geliangama Interchange',
    'Kahathuduwa Interchange',
    'Kottawa Interchange',
    'Kaduwela Interchange',
  ];

  // Component return
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerText}>Time Schedule</Text>
      </View>

      {/* Schedule section */}
      <ScrollView>
        {/* Black table headers */}
        <View style={styles.tableHeader}>
          <View style={styles.tableHeaderItem}>
            <Text style={styles.tableHeaderText}>KDUSC to KADAWATHA</Text>
          </View>
          <View style={styles.tableHeaderItem}>
            <Text style={styles.tableHeaderText}>KADAWATHA to KDUSC</Text>
          </View>
        </View>

        {/* Schedule rows */}
        {scheduleData.map((location, index) => (
          <View key={index} style={styles.row}>
            <View style={styles.locationCell}>
              <Text>{location}</Text>
            </View>
            <View style={styles.timeCell}>
              <Text>3.40 PM</Text>
            </View>
            <View style={styles.timeCell}>
              <Text>3.45 PM</Text>
            </View>
            <View style={styles.timeCell}>
              <Text>3.40 PM</Text>
            </View>
            <View style={styles.timeCell}>
              <Text>3.45 PM</Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

// Stylesheet
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
  },
  header: {
    backgroundColor: '#ffa500', // Orange color
    padding: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  tableHeader: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#000',
    padding: 10,
  },
  tableHeaderItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
  },
  tableHeaderText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  row: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    marginVertical: 1,
  },
  locationCell: {
    flex: 2,
    padding: 10,
    borderRightWidth: 1,
    borderColor: '#ddd',
  },
  timeCell: {
    flex: 1,
    padding: 10,
    alignItems: 'center',
    borderRightWidth: 1,
    borderColor: '#ddd',
  },
});

export default TimeShedule;
