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
  const navigation = useNavigation();
  const hasMounted = useRef(false);

  const handleLogin = async () => {
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
        console.log('No user data found in Firestore');
        Alert.alert('Error', 'User data not found. Please contact support.');
      }
    } catch (error) {
      console.error('Login error:', error);
      Alert.alert('Login Error', error.message);
    } finally {
      setIsLoading(false);
    }
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
          Alert.alert('Error', error.message);
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
    navigation.navigate('Registration'); // Make sure you have a 'Register' screen in your navigation stack
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
              onChangeText={setEmail}
              style={styles.input}
              editable={!isLoading}
              autoCapitalize="none"
              keyboardType="email-address"
            />
            <TextInput
              placeholder="Password"
              placeholderTextColor="#A0A0A0"
              value={password}
              onChangeText={setPassword}
              style={styles.input}
              secureTextEntry
              editable={!isLoading}
            />
          </View>
          <View style={styles.buttonContainer}>
            {isLoading ? (
              <ActivityIndicator size="large" color="#ff8c52" />
            ) : (
              <>
                <TouchableOpacity
                  onPress={handleLogin}
                  style={styles.loginButton}>
                  <Text style={styles.buttonText}>Login</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={forgotPassword}
                  style={styles.forgotPasswordButton}>
                  <Text style={styles.forgotPasswordText}>
                    Forgot Password?
                  </Text>
                </TouchableOpacity>
              </>
            )}
          </View>
          <View style={styles.registerContainer}>
            <Text style={styles.registerText}>Don't have an account? </Text>
            <TouchableOpacity onPress={navigateToRegister}>
              <Text style={styles.registerLink}>Register</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
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
});

export default Login;
