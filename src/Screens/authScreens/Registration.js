import React, {useState} from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import {createUserWithEmailAndPassword} from 'firebase/auth';
import {setDoc, doc} from 'firebase/firestore';
import {useNavigation} from '@react-navigation/native';
import {auth, db} from '../../../firebase';
import {Icon} from 'react-native-elements';

const Registration = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [enrollmentNum, setEnrollmentNum] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [role, setRole] = useState('student');
  const [isLoading, setIsLoading] = useState(false);
  const navigation = useNavigation();

  const validateInputs = () => {
    // Email validation
    const emailRegex =
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z]{2,})$/;
    if (!email) {
      showAlert('Email is required');
      return false;
    } else if (!emailRegex.test(email)) {
      showAlert('Please enter a valid email address');
      return false;
    }

    // Password validation
    if (!password) {
      showAlert('Password is required');
      return false;
    } else if (password.length < 6) {
      showAlert('Password must be at least 6 characters long');
      return false;
    }

    // Confirm password validation
    if (password !== confirmPassword) {
      showAlert('Passwords do not match');
      return false;
    }

    // Full name validation
    if (!fullName) {
      showAlert('Full name is required');
      return false;
    }

    // Enrollment number validation
    if (!enrollmentNum) {
      showAlert(
        role === 'student'
          ? 'Student Enrollment Number is required'
          : 'Lecturer ID is required',
      );
      return false;
    }

    // Phone number validation
    const phoneRegex = /^\d{10}$/;
    if (!phoneNumber) {
      showAlert('Phone number is required');
      return false;
    } else if (!phoneRegex.test(phoneNumber)) {
      showAlert('Phone number must be exactly 10 digits');
      return false;
    }

    return true;
  };

  const showAlert = message => {
    Alert.alert('Registration Error', message);
  };

  const handleRegister = async () => {
    if (!validateInputs()) {
      return;
    }
    setIsLoading(true);

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password,
      );
      const user = userCredential.user;

      await setDoc(doc(db, 'userdata', user.email), {
        email: user.email,
        fullName: fullName,
        enrollmentNum: enrollmentNum,
        phoneNumber: phoneNumber,
        role: role,
      });
      setIsLoading(false);
      console.log('Registered with:', user.email, 'as', role);
      Alert.alert('Success', 'Registration successful!', [
        {
          text: 'OK',
          onPress: () =>
            navigation.navigate('SigninScreen', {justRegistered: true}),
        },
      ]);
    } catch (error) {
      console.log('Registration Error:', error.message);
      setIsLoading(false);
      showAlert(error.message);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <KeyboardAvoidingView behavior="padding">
          <View style={styles.headerContainer}>
            <Icon
              name="user-plus"
              type="font-awesome"
              size={50}
              color="#ff8c52"
            />
            <Text style={styles.title}>Create Account</Text>
          </View>
          <View style={styles.inputContainer}>
            <View style={styles.inputWrapper}>
              <Icon name="user" type="font-awesome" size={20} color="#ff8c52" />
              <TextInput
                placeholder="Full Name"
                value={fullName}
                onChangeText={setFullName}
                style={styles.input}
                placeholderTextColor="#999"
              />
            </View>
            <View style={styles.inputWrapper}>
              <Icon
                name="envelope"
                type="font-awesome"
                size={20}
                color="#ff8c52"
              />
              <TextInput
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                style={styles.input}
                placeholderTextColor="#999"
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
            <View style={styles.inputWrapper}>
              <Icon name="lock" type="font-awesome" size={20} color="#ff8c52" />
              <TextInput
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                style={styles.input}
                secureTextEntry
                placeholderTextColor="#999"
              />
            </View>
            <View style={styles.inputWrapper}>
              <Icon name="lock" type="font-awesome" size={20} color="#ff8c52" />
              <TextInput
                placeholder="Confirm Password"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                style={styles.input}
                secureTextEntry
                placeholderTextColor="#999"
              />
            </View>
            <View style={styles.inputWrapper}>
              <Icon
                name="id-card"
                type="font-awesome"
                size={20}
                color="#ff8c52"
              />
              <TextInput
                placeholder={
                  role === 'student'
                    ? 'Student Enrollment Number'
                    : 'Lecturer ID'
                }
                value={enrollmentNum}
                onChangeText={setEnrollmentNum}
                style={styles.input}
                placeholderTextColor="#999"
              />
            </View>
            <View style={styles.inputWrapper}>
              <Icon
                name="phone"
                type="font-awesome"
                size={20}
                color="#ff8c52"
              />
              <TextInput
                placeholder="Phone Number"
                value={phoneNumber}
                onChangeText={setPhoneNumber}
                style={styles.input}
                placeholderTextColor="#999"
                keyboardType="phone-pad"
                maxLength={10}
              />
            </View>
          </View>
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              onPress={handleRegister}
              style={styles.button}
              disabled={isLoading}>
              {isLoading ? (
                <ActivityIndicator size="small" color="#ffffff" />
              ) : (
                <Text style={styles.buttonText}>Register</Text>
              )}
            </TouchableOpacity>
          </View>
          <View style={styles.loginContainer}>
            <Text style={styles.loginText}>Already have an account?</Text>
            <TouchableOpacity
              onPress={() => navigation.navigate('SigninScreen')}>
              <Text style={styles.loginLink}>Login here</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#ff8c52',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center', // Add this to center the ActivityIndicator
  },
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollViewContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 10,
  },
  inputContainer: {
    width: '100%',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 10,
    marginBottom: 15,
    paddingHorizontal: 15,
    elevation: 2,
  },
  input: {
    flex: 1,
    paddingVertical: 15,
    paddingHorizontal: 10,
    color: '#333',
    fontSize: 16,
  },
  roleLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  roleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  roleButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#f5bda2',
    marginHorizontal: 5,
  },
  roleButtonActive: {
    backgroundColor: '#ff8c52',
  },
  roleButtonText: {
    color: '#f5bda2',
    fontWeight: 'bold',
    fontSize: 16,
    marginLeft: 10,
  },
  roleButtonTextActive: {
    color: 'white',
  },
  buttonContainer: {
    width: '100%',
    marginTop: 20,
  },
  button: {
    backgroundColor: '#ff8c52',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18,
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  loginText: {
    color: '#333',
    fontSize: 16,
  },
  loginLink: {
    color: '#ff8c52',
    fontWeight: 'bold',
    fontSize: 16,
    marginLeft: 5,
  },
});

export default Registration;
