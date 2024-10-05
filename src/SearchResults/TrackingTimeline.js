import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, ScrollView} from 'react-native';
import {getDocs, collection, query, where, onSnapshot} from 'firebase/firestore';
import {db} from '../../firebase'; // Adjust the import path as necessary

const TrackingTimeline = () => {
  const [interchanges, setInterchanges] = useState([]);
  const [isToCampus, setIsToCampus] = useState(false);

  useEffect(() => {
    // Determine if today is Tuesday or Saturday
    const today = new Date();
    const dayOfWeek = today.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday

    // Set isToCampus based on the day of the week

    if (dayOfWeek > 2) {
      setIsToCampus(false);
    } else if (dayOfWeek <= 1) {
      setIsToCampus(true);
    }
    // setIsToCampus(dayOfWeek === 2 || dayOfWeek === 6); // Tuesday or Saturday
    const interchangesQuery = query(
      collection(db, 'interchanges'),
      where('distance', '!=', null),
    );
    // Set up the real-time listener
    const unsubscribe = onSnapshot(
      interchangesQuery,
      querySnapshot => {
        const fetchedInterchanges = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));

        // Sort the interchanges based on the isToCampus state
        const sortedInterchanges = fetchedInterchanges.sort((a, b) =>
          isToCampus ? b.distance - a.distance : a.distance - b.distance,
        );

        setInterchanges(sortedInterchanges);
      },
      error => {
        console.error('Error fetching interchanges:', error);
      },
    );

    // Cleanup function to unsubscribe from the listener when the component unmounts
    return () => unsubscribe();
  }, []);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Timeline</Text>
      <View style={styles.timeline}>
        {interchanges.map((interchange, index) => (
          <View key={index} style={styles.timelineItem}>
            <View style={styles.timelineLeft}>
              <Text style={styles.time}>{interchange.distance} km</Text>
            </View>
            <View style={styles.timelineCenter}>
              <View
                style={[
                  styles.dot,
                  interchange.passed ? styles.dotPassed : styles.dotFuture,
                ]}
              />
              {index !== interchanges.length - 1 && (
                <View
                  style={[
                    styles.line,
                    interchange.passed ? styles.linePassed : styles.lineFuture,
                  ]}
                />
              )}
            </View>
            <View style={styles.timelineRight}>
              <Text style={styles.eventText}>{interchange.name}</Text>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F7F3',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  headerText: {
    fontSize: 12,
    color: '#888',
  },
  headerValue: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  timeline: {
    marginTop: 20,
    marginBottom: 20,
  },
  timelineItem: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  timelineLeft: {
    width: 50,
    alignItems: 'flex-end',
    paddingRight: 10,
  },
  time: {
    fontSize: 12,
    color: '#888',
  },
  timelineCenter: {
    width: 20,
    alignItems: 'center',
  },
  dot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 3,
  },
  dotPassed: {
    backgroundColor: '#4CAF50',
    borderColor: '#4CAF50',
  },
  dotFuture: {
    backgroundColor: '#F8F7F3',
    borderColor: '#4CAF50',
  },
  line: {
    width: 2,
    flex: 1,
    marginTop: 4,
  },
  linePassed: {
    backgroundColor: '#4CAF50',
  },
  lineFuture: {
    backgroundColor: '#DDD',
  },
  timelineRight: {
    flex: 1,
    paddingLeft: 10,
  },
  eventText: {
    fontSize: 14,
  },
});

export default TrackingTimeline;
