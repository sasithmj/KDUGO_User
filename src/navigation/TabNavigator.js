import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {View, Text} from 'react-native';
import HomeScreen from '../Screens/HomeScreen';
import SearchResults from '../SearchResults/SerachResults';
import NewLost from '../imagePicker/NewLost';
import ProfilePage from '../Screens/profile/Profile';
import Icon from 'react-native-vector-icons/Ionicons'; // Make sure to install react-native-vector-icons

const Tab = createBottomTabNavigator();
function TabNavigator() {
  const [unreadNotificationCount, setUnreadNotificationCount] = useState(0);

  // Fetch the unread notifications count from AsyncStorage or Firestore (if necessary)
  useEffect(() => {
    const fetchUnreadCount = async () => {
      try {
        const storedUnreadCount = await AsyncStorage.getItem('unreadCount');
        if (storedUnreadCount !== null) {
          setUnreadNotificationCount(parseInt(storedUnreadCount));
        }
      } catch (error) {
        console.error('Error fetching unread count', error);
      }
    };

    fetchUnreadCount();
  }, []);

  return (
    <Tab.Navigator
      initialRouteName="HomeScreen"
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === 'HomeScreen') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Notifications') {
            iconName = focused ? 'notifications' : 'notifications-outline';
          } else if (route.name === 'profile') {
            iconName = focused ? 'person' : 'person-outline';
          }
          return (
            <View>
              <Ionicons name={iconName} size={size} color={color} />
              {route.name === 'Notifications' && unreadNotificationCount > 0 && (
                <View
                  style={{
                    position: 'absolute',
                    right: -6,
                    top: -3,
                    backgroundColor: 'red',
                    borderRadius: 6,
                    width: 12,
                    height: 12,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <Text style={{ color: 'white', fontSize: 10 }}>
                    {unreadNotificationCount}
                  </Text>
                </View>
              )}
            </View>
          );
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
      })}
    >
      <Tab.Screen name="HomeScreen" component={HomeStack} />
      <Tab.Screen name="Notifications" component={Notifications} />
      <Tab.Screen name="profile" component={ProfilePage} />
    </Tab.Navigator>
  );
}
