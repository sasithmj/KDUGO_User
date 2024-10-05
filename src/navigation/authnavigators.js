import React, {useEffect, useState} from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import SigninWelcomeScreen from '../Screens/authScreens/SigninWelcomeScreen';
import HomeScreen from '../Screens/HomeScreen';
import HomeMap from '../Components/Homemap';
import SearchResults from '../SearchResults/SerachResults';
import DestinationSearch from '../DestinationSearch/DestinationSearch';
import Signup from '../Screens/authScreens/Signup';
import Registration from '../Screens/authScreens/Registration';
import NewLost from '../imagePicker/NewLost';
import BookSeats from '../Components/BookSeats/BookSeats';
import BookRegitration from '../Components/BookSeats/BookRegitration';
import PaymentScreen from '../Components/BookSeats/PaymentScreen';
import PaymentView from '../Components/BookSeats/PaymentView';
import Lost from '../imagePicker/Lost';
import HomeSearch from '../Components/HomeSearch/HomeSearch';
import ProfilePage from '../Screens/profile/Profile';
import Notifications from '../Screens/profile/Notifications';
import ReservationHistory from '../Screens/profile/ReservationHistoryScreen';

import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Details from '../Screens/Details';
import TicketPrices from '../Screens/Details/TicketPrices';
import TimeShedule from '../Screens/Details/TimeShedule';
import DriverDetails from '../Screens/Details/DriverDetails';
import BusDetails from '../Screens/Details/BusDetails';
import Emergency from '../Screens/EmergencyDetails/Emergency';
import FeedBack from '../Screens/FeedBack/FeedBack';
import {getUnreadNotificationInboxCount} from 'native-notify';
import {useNotification} from './NotificationContext';
import QRScannerScreen from '../Screens/QRscreens/QrScannerScreen';
const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function HomeStack() {
  // const [unreadNotificationCount, setUnreadNotificationCount] = useState(0);

  // useEffect(async () => {
  //     let unreadCount = await getUnreadNotificationInboxCount(23820, 'wjDwtkWCD3q9GqMf3HdXUJ');
  //     console.log("unreadCount: ", unreadCount);
  //     setUnreadNotificationCount(unreadCount);
  // });

  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen
        name="HomeScreen"
        component={HomeScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="indexScreen"
        component={SearchResults}
        options={{
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="DestinationSearch"
        component={DestinationSearch}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="newLost"
        component={NewLost}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="BookSeats"
        component={BookSeats}
        options={{
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="BookRegistration"
        component={BookRegitration}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="PaymentScreen"
        component={PaymentScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="PaymentView"
        component={PaymentView}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="HomeSearch"
        component={HomeSearch}
        options={{
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="SearchResults"
        component={SearchResults}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="ReservationHistory"
        component={ReservationHistory}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="Details"
        component={Details}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="TicketPrices"
        component={TicketPrices}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="TimeShedule"
        component={TimeShedule}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="DriverDetails"
        component={DriverDetails}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="BusDetails"
        component={BusDetails}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="Emergency"
        component={Emergency}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="FeedBack"
        component={FeedBack}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="qrscan"
        component={QRScannerScreen}
        options={{
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
}

function TabNavigator() {
  const {unreadCount} = useNotification();

  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        tabBarIcon: ({focused, color, size}) => {
          let iconName;
          if (route.name === 'HomeScreen') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Notifications') {
            iconName = focused ? 'notifications' : 'notifications-outline';
          } else if (route.name === 'profile') {
            iconName = focused ? 'person' : 'person-outline';
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#ff8c52',
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
        tabBarStyle: {
          backgroundColor: 'white',
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          height: 60,
          paddingBottom: 5,
        },
      })}>
      <Tab.Screen name="HomeScreen" component={HomeStack} />
      <Tab.Screen
        name="Notifications"
        component={Notifications}
        options={{
          tabBarBadge: unreadCount > 0 ? unreadCount : null,
          tabBarBadgeStyle: {backgroundColor: '#ff8c52'},
          tabBarBadgeStyle: {backgroundColor: '#ff8c52', color: 'white'},
        }}
      />
      <Tab.Screen name="profile" component={ProfilePage} />
    </Tab.Navigator>
  );
}

export default function AuthStack() {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen
        name="SigninWelcomeScreen"
        component={SigninWelcomeScreen}
      />
      <Stack.Screen name="SigninScreen" component={Signup} />
      <Stack.Screen name="Registration" component={Registration} />
      <Stack.Screen name="HomeScreen" component={TabNavigator} />
    </Stack.Navigator>
  );
}
