import React from 'react';
import {createDrawerNavigator} from '@react-navigation/drawer';
import {NavigationContainer} from '@react-navigation/native';
import HomeScreen from './HomeScreen'; // Import your HomeScreen component
import ProfileScreen from './ProfileScreen'; // Example of another screen for the drawer

const Drawer = createDrawerNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Drawer.Navigator initialRouteName="Home">
        <Drawer.Screen name="Home" component={HomeScreen} />
        <Drawer.Screen name="Profile" component={ProfileScreen} />
        {/* Add more screens here */}
      </Drawer.Navigator>
    </NavigationContainer>
  );
}
