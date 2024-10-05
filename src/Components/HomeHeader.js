import React, {useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Modal} from 'react-native';
import {Icon, withBadge} from 'react-native-elements';
import {colors, parameters} from '../global/styles';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation} from '@react-navigation/native';

export default function HomeHeader({onLogout}) {
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const navigation = useNavigation();
  const BadgeIcon = withBadge(0)(Icon);

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  const handleDropdown = () => {
    setDropdownVisible(false);
    onLogout();
  };
  const logout = async () => {
    try {
      // Remove 'userRole' and 'userEmail' from AsyncStorage
      await AsyncStorage.removeItem('userRole');
      await AsyncStorage.removeItem('userEmail');
      navigation.navigate('SigninWelcomeScreen');
      console.log('User logged out, storage cleared');
    } catch (error) {
      console.error('Error clearing storage during logout:', error);
    }
  };

  return (
    <View style={styles.header}>
      <View style={styles.iconContainer}>
        <Icon
          type="material-community"
          name="menu"
          color={colors.cardbackground}
          size={32}
        />
      </View>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>Kdugo</Text>
      </View>

      <Modal
        transparent={true}
        visible={dropdownVisible}
        onRequestClose={() => setDropdownVisible(false)}>
        <TouchableOpacity
          style={styles.modalOverlay}
          onPress={() => setDropdownVisible(false)}>
          <View style={styles.dropdown}>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('profile');
              }}
              style={styles.dropdownItem}>
              <View
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                }}>
                <Icon
                  type="material-community"
                  name="account-circle"
                  size={20}
                  color={colors.grey3}
                />
                <Text style={styles.dropdownText}>Profile</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={logout} style={styles.dropdownItem}>
              <View
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                }}>
                <Icon
                  type="material-community"
                  name="logout"
                  size={20}
                  color={colors.grey3}
                />
                <Text style={styles.dropdownText}>Logout</Text>
              </View>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    backgroundColor: colors.buttons,
    height: parameters.headerHeight,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 15,
  },
  titleContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    color: colors.cardbackground,
    fontSize: 25,
    fontWeight: '100',
  },
  iconsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 15,
  },
  profileIcon: {
    marginLeft: 15,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
  },
  dropdown: {
    backgroundColor: colors.cardbackground,
    marginTop: parameters.headerHeight,
    marginRight: 10,
    borderRadius: 5,
    padding: 10,
    elevation: 5,
  },
  dropdownItem: {
    padding: 10,
  },
  dropdownText: {
    fontSize: 16,
    color: colors.grey1,
    marginLeft: 8,
  },
});
