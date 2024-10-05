import React from "react";
import { View, Text, StyleSheet,Pressable } from "react-native";
import AntDesign from "react-native-vector-icons/AntDesign";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { colors } from "../../global/styles"; 
import Entypo from "react-native-vector-icons/Entypo";
import HomeMap from "../Homemap";
import { useNavigation } from "@react-navigation/native";

const HomeSearch = (props) => {
  const navigation = useNavigation();

  const goToSearch = () => {
   navigation.navigate('DestinationSearch')
  }
  return (
    <View style={styles.container}>
      <HomeMap />
      
      <View style={styles.bottomContainer}>
        <Pressable onPress={goToSearch} style={styles.inputBox}>
          <Text style={styles.inputText}>Where To?</Text>

          <View style={styles.timeContainer}>
            <AntDesign name={"clockcircle"} size={16} color={'#535353'} />
            <Text style={styles.timeText}>Now</Text>
            <MaterialIcons name={'keyboard-arrow-down'} size={16} color={colors.primary} />
          </View>
        </Pressable>
        
        <View style={styles.row}>
          <View style={styles.iconContainer}>
            <AntDesign name={"clockcircle"} size={20} color={'white'} />
          </View>
          <Text style={styles.destinationText}>Spin Nightclub</Text>
        </View>

        <View style={styles.row}>
          <View style={[styles.iconContainer, { backgroundColor: 'white' }]}>
            <Entypo name={"home"} size={20} color={'#FFA500'} />
          </View>
          <Text style={styles.destinationText}>Home</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1, // Takes up the full height of the screen
  },
  bottomContainer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    backgroundColor: 'white', // To ensure it's separate from the map
    padding: 10,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5, // For Android shadow
  },
  inputBox: {
    backgroundColor: '#D3D3D3', 
    padding: 15,
    borderRadius: 10, 
    flexDirection: 'row', 
    alignItems: 'center',
    justifyContent: 'space-between', 
  },
  inputText: {
    fontSize: 18,
    fontWeight: '600',
    color: 'black', 
  },
  timeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: 100,
    paddingHorizontal: 10, // Use horizontal padding for more control
    paddingVertical: 5, // Reduce vertical padding if it’s causing issues
    backgroundColor: '#ffffff', // White background
    borderRadius: 25, // Adjust border radius for a more consistent appearance
    borderWidth: 1, // Optional: Add a border to make the container more visible
    borderColor: '#dddddd', // Light gray border
  },
  
  timeText: {
    marginHorizontal: 5,
    color: colors.primary, 
  },
  row: {
    flexDirection: 'row',
    padding: 20,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: '#D3D3D3',
    backgroundColor: '#FFFFFF', // Ensure background is not affecting text visibility
  },
  
  iconContainer: {
    backgroundColor: '#b3b3b3',
    padding: 10,
    borderRadius: 25,
  },
  destinationText: {
    marginLeft: 10,
    fontWeight: '500',
    fontSize: 16,
    color: '#000000', // Set to black or another visible color
  },
  
});

export default HomeSearch;
