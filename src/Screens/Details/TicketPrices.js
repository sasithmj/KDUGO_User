import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, ActivityIndicator } from 'react-native';
import firestore from '@react-native-firebase/firestore'; // Assuming you're using @react-native-firebase

const TicketPrices = () => {
  const [loading, setLoading] = useState(true); // Set loading to true on component mount
  const [ticketPrices, setTicketPrices] = useState([]); // Initial empty array of ticket prices

  useEffect(() => {
    const subscriber = firestore()
      .collection('ticketPrices')
      .onSnapshot(querySnapshot => {
        const ticketPrices = [];

        querySnapshot.forEach(documentSnapshot => {
          ticketPrices.push({
            ...documentSnapshot.data(),
            key: documentSnapshot.id, // To uniquely identify each item in the list
          });
        });

        setTicketPrices(ticketPrices);
        setLoading(false);
      });

    // Unsubscribe from events when no longer in use
    return () => subscriber();
  }, []);

  if (loading) {
    return <ActivityIndicator size="large" />;
  }

  return (
    <FlatList
      data={ticketPrices}
      keyExtractor={item => item.key}
      renderItem={({ item }) => (
        <View style={{ padding: 10, borderBottomWidth: 1, borderBottomColor: '#ccc' }}>
          <Text style={{ fontSize: 16, fontWeight: 'bold' }}>{item.exitName}</Text>
          <Text style={{ fontSize: 14, color: '#666' }}>Price: {item.price}</Text>
        </View>
      )}
    />
  );
};

export default TicketPrices;
