import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  ActivityIndicator,
  TextInput,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {Icon} from 'react-native-elements';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {auth, db} from '../../../firebase';
import {doc, getDoc, updateDoc} from 'firebase/firestore';
import {launchImageLibrary} from 'react-native-image-picker';
import storage from '@react-native-firebase/storage';

const ProfilePage = () => {
  const [userInfo, setUserInfo] = useState(null);
  const [loadingUserInfo, setLoadingUserInfo] = useState(true);
  const [uploadingImage, setUploadingImage] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    fetchUserData();
  }, []);

  const handleImagePick = async () => {
    const result = await launchImageLibrary({mediaType: 'photo'});
    if (!result.didCancel && result.assets.length > 0) {
      const image = result.assets[0];
      uploadImageToFirebase(image.uri);
    }
  };

  const uploadImageToFirebase = async imageUri => {
    setUploadingImage(true);
    try {
      const userEmail = await AsyncStorage.getItem('userEmail');
      const fileName = userEmail + '_profile.jpg';
      const storageRef = storage().ref(`profile/${fileName}`);

      // Upload the file to Firebase Storage
      const response = await fetch(imageUri);
      const blob = await response.blob();
      await storageRef.put(blob);

      // Get the image URL
      const downloadURL = await storageRef.getDownloadURL();

      // Save the URL to Firestore
      const userDocRef = doc(db, 'userdata', userEmail);
      await updateDoc(userDocRef, {profileImage: downloadURL});

      // Update state
      setUserInfo(prev => ({...prev, profileImage: downloadURL}));
    } catch (error) {
      console.log('Error uploading image:', error);
    } finally {
      setUploadingImage(false);
    }
  };

  const fetchUserData = async () => {
    setLoadingUserInfo(true);
    try {
      const savedEmail = await AsyncStorage.getItem('userEmail');
      const userDocRef = doc(db, 'userdata', savedEmail);
      const userDoc = await getDoc(userDocRef);
      if (userDoc.exists()) {
        setUserInfo(userDoc.data());
      } else {
        console.log('No user data found in Firebase');
      }
    } catch (error) {
      console.log('Error fetching user data:', error);
    } finally {
      setLoadingUserInfo(false);
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem('userRole');
      await AsyncStorage.removeItem('userEmail');
      navigation.navigate('SigninWelcomeScreen');
      console.log('User logged out, storage cleared');
    } catch (error) {
      console.error('Error clearing storage during logout:', error);
    }
  };

  // InfoItem component with local state for each field
  const InfoItem = ({label, value, field, editable}) => {
    const [localValue, setLocalValue] = useState(value); // Local state for each field
    const [isEditing, setIsEditing] = useState(false); // Editing state for each field

    const handleEdit = () => {
      setIsEditing(true);
    };

    const handleSave = async () => {
      try {
        const userEmail = await AsyncStorage.getItem('userEmail');
        const userDocRef = doc(db, 'userdata', userEmail);
        await updateDoc(userDocRef, {[field]: localValue});

        // Update the global userInfo state
        setUserInfo(prev => ({...prev, [field]: localValue}));
        setIsEditing(false);
      } catch (error) {
        console.log('Error updating user data:', error);
      }
    };

    return (
      <View style={styles.infoItem}>
        <Text style={styles.infoLabel}>{label}</Text>
        <View style={styles.infoValueContainer}>
          {isEditing ? (
            <TextInput
              style={styles.input}
              value={localValue}
              onChangeText={text => setLocalValue(text)} // Use localValue for each input field
              placeholder={`Enter new ${label}`}
            />
          ) : (
            <Text style={styles.infoValue}>{value}</Text>
          )}
          {isEditing ? (
            <TouchableOpacity onPress={handleSave}>
              <Icon name="check" type="feather" size={20} color="green" />
            </TouchableOpacity>
          ) : editable ? (
            <TouchableOpacity onPress={handleEdit}>
              <Icon name="edit" type="feather" size={20} color="#888" />
            </TouchableOpacity>
          ) : null}
        </View>
      </View>
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" type="feather" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Profile</Text>
      </View>

      {loadingUserInfo ? (
        <ActivityIndicator size="large" color="#ff8c52" style={styles.loader} />
      ) : (
        <>
          <View style={styles.profileImageContainer}>
            <TouchableOpacity onPress={handleImagePick}>
              <Image
                source={{
                  uri:
                    userInfo?.profileImage || 'https://via.placeholder.com/150',
                }}
                style={styles.profileImage}
              />
            </TouchableOpacity>
            {uploadingImage && (
              <ActivityIndicator size="small" color="#ff8c52" />
            )}
          </View>

          <View style={styles.infoContainer}>
            <Text style={styles.sectionTitle}>Your Info</Text>
            <InfoItem
              label="Full Name"
              value={userInfo?.fullName}
              field="fullName"
              editable={true}
            />
            <InfoItem
              label="Email Address"
              value={userInfo?.email}
              field="email"
              editable={false}
            />
            <InfoItem
              label="Phone Number"
              value={userInfo?.phoneNumber}
              field="phoneNumber"
              editable={true}
            />
            <InfoItem
              label="Role"
              value={userInfo?.role}
              field="role"
              editable={false}
            />
          </View>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() =>
              navigation.navigate('ReservationHistory', {
                userEmail: userInfo?.email,
              })
            }>
            <Text style={styles.menuItemText}>Reservation History</Text>
            <Icon name="chevron-right" type="feather" size={20} color="#888" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.logoutButton} onPress={logout}>
            <Text style={styles.logoutButtonText}>LOGOUT</Text>
          </TouchableOpacity>
        </>
      )}
    </ScrollView>
  );
};

export default ProfilePage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 20,
  },
  loader: {
    marginTop: 50,
  },
  profileImageContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  infoContainer: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  infoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  infoLabel: {
    fontSize: 14,
    color: '#888',
  },
  infoValueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoValue: {
    fontSize: 14,
    marginRight: 10,
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  menuItemText: {
    fontSize: 16,
  },
  bookingsContainer: {
    padding: 20,
  },
  bookingItem: {
    backgroundColor: '#f8f8f8',
    padding: 15,
    borderRadius: 5,
    marginBottom: 10,
  },
  bookingText: {
    fontSize: 14,
    marginBottom: 5,
  },
  cancelButton: {
    backgroundColor: '#ff4d4d',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  cancelButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  logoutButton: {
    backgroundColor: '#FFA500',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginHorizontal: 20,
    marginTop: 30,
    marginBottom: 20,
  },
  logoutButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
