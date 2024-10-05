import React from 'react';
import { View, FlatList, StyleSheet, Image, Text } from 'react-native';

export default function MyFilesList({ files }) {
  const Item = ({ url, text }) => (
    <View style={styles.item}>
      <Image source={{ uri: url }} style={styles.image} />
      <Text style={styles.text}>{text}</Text>
    </View>
  );

  return (
    <FlatList
      data={files}
      renderItem={({ item }) => <Item url={item.url} text={item.text} />}
      keyExtractor={(item, index) => index.toString()}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  item: {
    backgroundColor: '#f8f9fa', // Light gray background for a subtle look
    padding: 20, // Increased padding for better spacing
    marginVertical: 10, // Slightly more margin between items
    marginHorizontal: 0,
    borderRadius: 16, // Increased border radius for a more rounded appearance
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4, // Increased height for more prominent shadow
    },
    shadowOpacity: 0.1,
    shadowRadius: 6, // Increased shadow radius for a softer shadow
    elevation: 5, // Increased elevation for a more raised look
    alignItems: 'center',
  },
  image: {
    width: '200%',
    height:400, // Increased height for a larger photo size
    borderRadius: 16, // Match the item’s border radius for consistency
    marginBottom: 16, // Increased bottom margin for better spacing
    resizeMode: 'cover',
  },
  text: {
    fontSize: 16, // Reduced font size for a cleaner look
    fontWeight: '500', // Slightly lighter font weight
    color: '#212529', // Darker gray for better readability
    textAlign: 'center',
  },
});
