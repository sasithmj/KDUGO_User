import React, {useState, useRef} from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ActivityIndicator,
  SafeAreaView,
  Platform,
  Modal,
} from 'react-native';
import {
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
} from 'firebase/auth';
import {getDoc, doc} from 'firebase/firestore';
import {useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {auth, db} from '../../../firebase';

const Login = ({route}) => {
  const {justRegistered} = route.params || {};
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const navigation = useNavigation();
  const hasMounted = useRef(false);

  const validateInputs = () => {
    let isValid = true;

    const emailRegex =
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z]{2,})$/;

    if (!email) {
      setEmailError('Email is required');
      isValid = false;
    } else if (!emailRegex.test(email)) {
      setEmailError('Please enter a valid email address');
      isValid = false;
    } else {
      setEmailError('');
    }

    return isValid;
  };

  const handleLogin = async () => {
    if (!validateInputs()) {
      return;
    }

    setIsLoading(true);
    try {
      const userCredentials = await signInWithEmailAndPassword(
        auth,
        email,
        password,
      );
      const user = userCredentials.user;
      console.log('Logged in with:', user.email);

      const userDoc = await getDoc(doc(db, 'userdata', user.email));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        const userRole = userData.role;
        const userEmail = userData.email;

        await AsyncStorage.setItem('userRole', userRole);
        await AsyncStorage.setItem('userEmail', userEmail);
        console.log('User role and email saved:', userRole);

        navigation.navigate('HomeScreen');
      } else {
        throw new Error('user_data_not_found');
      }
    } catch (error) {
      console.error('Login error:', error.code);
      handleLoginError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoginError = error => {
    let message = 'An unexpected error occurred. Please try again later.';

    switch (error.code) {
      case 'auth/user-not-found':
      case 'auth/wrong-password':
      case 'auth/invalid-credential':
        message = 'Invalid email or password. Please try again.';
        break;
      case 'auth/invalid-email':
        message = 'Invalid email address. Please check and try again.';
        break;
      case 'auth/user-disabled':
        message = 'This account has been disabled. Please contact support.';
        break;
      case 'auth/too-many-requests':
        message =
          'Too many unsuccessful login attempts. Please try again later.';
        break;
    }

    if (error.message === 'user_data_not_found') {
      message = 'User data not found. Please contact support.';
    }

    Alert.alert('Login Error', message);
  };

  const forgotPassword = () => {
    if (email) {
      setIsLoading(true);
      sendPasswordResetEmail(auth, email)
        .then(() => {
          Alert.alert(
            'Password Reset',
            'Password reset email sent successfully.',
          );
        })
        .catch(error => {
          handleLoginError(error);
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      Alert.alert(
        'Email Required',
        'Please enter your email address to reset your password.',
      );
    }
  };

  const navigateToRegister = () => {
    navigation.navigate('Registration');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}>
        <View style={styles.innerContainer}>
          <Text style={styles.title}>Welcome Back</Text>
          <Text style={styles.subtitle}>Sign in to continue</Text>
          <View style={styles.inputContainer}>
            <TextInput
              placeholder="Email"
              placeholderTextColor="#A0A0A0"
              value={email}
              onChangeText={text => {
                setEmail(text);
                setEmailError('');
              }}
              style={[styles.input, emailError && styles.inputError]}
              editable={!isLoading}
              autoCapitalize="none"
              keyboardType="email-address"
            />
            {emailError ? (
              <Text style={styles.errorText}>{emailError}</Text>
            ) : null}
            <TextInput
              placeholder="Password"
              placeholderTextColor="#A0A0A0"
              value={password}
              onChangeText={text => {
                setPassword(text);
                setPasswordError('');
              }}
              style={[styles.input, passwordError && styles.inputError]}
              secureTextEntry
              editable={!isLoading}
            />
            {passwordError ? (
              <Text style={styles.errorText}>{passwordError}</Text>
            ) : null}
          </View>
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              onPress={handleLogin}
              style={styles.loginButton}
              disabled={isLoading}>
              <Text style={styles.buttonText}>Login</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={forgotPassword}
              style={styles.forgotPasswordButton}
              disabled={isLoading}>
              <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.registerContainer}>
            <Text style={styles.registerText}>Don't have an account? </Text>
            <TouchableOpacity onPress={navigateToRegister}>
              <Text style={styles.registerLink}>Student Registeration</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
      <Modal
        transparent={true}
        animationType="fade"
        visible={isLoading}
        onRequestClose={() => {}}>
        <View style={styles.modalBackground}>
          <View style={styles.activityIndicatorWrapper}>
            <ActivityIndicator size="large" color="#ff8c52" />
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  container: {
    flex: 1,
  },
  innerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ff8c52',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666666',
    marginBottom: 30,
  },
  inputContainer: {
    width: '100%',
    marginBottom: 20,
  },
  input: {
    backgroundColor: '#F5F5F5',
    color: '#333333',
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 12,
    fontSize: 16,
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
  },
  loginButton: {
    backgroundColor: '#ff8c52',
    width: '100%',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 15,
  },
  buttonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
  forgotPasswordButton: {
    padding: 10,
  },
  forgotPasswordText: {
    color: '#ff8c52',
    fontSize: 14,
    fontWeight: '600',
  },
  registerContainer: {
    flexDirection: 'row',
    marginTop: 20,
  },
  registerText: {
    color: '#666666',
    fontSize: 14,
  },
  registerLink: {
    color: '#ff8c52',
    fontSize: 14,
    fontWeight: '600',
  },

  inputError: {
    borderColor: 'red',
    borderWidth: 1,
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginBottom: 5,
  },
  modalBackground: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  activityIndicatorWrapper: {
    backgroundColor: 'white',
    height: 100,
    width: 100,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorModalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    maxWidth: '80%',
  },
  errorModalText: {
    fontSize: 16,
    marginBottom: 15,
    textAlign: 'center',
  },
  errorModalButton: {
    backgroundColor: '#ff8c52',
    padding: 10,
    borderRadius: 5,
  },
  errorModalButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default Login;
