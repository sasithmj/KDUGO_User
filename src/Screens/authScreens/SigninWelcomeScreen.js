import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, Image, SafeAreaView} from 'react-native';
import {Button} from 'react-native-elements';
import Swiper from 'react-native-swiper';

const SigninWelcomeScreen = ({navigation}) => {
  const [authState, setAuthState] = useState(false);

  useEffect(() => {
    const getEmailFromStorage = async () => {
      try {
        const savedEmail = await AsyncStorage.getItem('userEmail');
        if (savedEmail) {
          setAuthState(true);
          navigation.navigate('HomeScreen');
        }
      } catch (error) {
        console.log('Error fetching email from AsyncStorage:', error);
      }
    };

    getEmailFromStorage(); // Call the function to fetch email on mount
  }, []);

  const images = [
    require('../../../assets/imgs/bus.png-removebg-preview.png'),
    require('../../../assets/imgs/bus.png-removebg-preview.png'),
    require('../../../assets/imgs/bus.png-removebg-preview.png'),
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.headerText}>Discover Our Service</Text>
        <Text style={styles.headerText}>In Your Area</Text>
      </View>

      <View style={styles.swiperContainer}>
        <Swiper
          autoplay
          autoplayTimeout={4}
          dot={<View style={styles.dot} />}
          activeDot={<View style={styles.activeDot} />}>
          {images.map((image, index) => (
            <View key={index} style={styles.slide}>
              <Image source={image} style={styles.image} resizeMode="contain" />
            </View>
          ))}
        </Swiper>
      </View>

      <View style={styles.buttonContainer}>
        <Button
          title="Student"
          buttonStyle={styles.button}
          titleStyle={styles.buttonTitle}
          onPress={() => navigation.navigate('Registration')}
        />
        <Button
          title="Lecture"
          buttonStyle={styles.lecbutton}
          titleStyle={styles.buttonTitle}
          onPress={() => navigation.navigate('SigninScreen')}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  headerContainer: {
    flex: 2,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 20,
  },
  headerText: {
    fontSize: 28,
    color: '#ff8c52',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  swiperContainer: {
    flex: 4,
  },
  slide: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '80%',
    height: '80%',
  },
  dot: {
    backgroundColor: 'rgba(255,140,82,0.3)',
    width: 8,
    height: 8,
    borderRadius: 4,
    marginLeft: 3,
    marginRight: 3,
    marginTop: 3,
    marginBottom: 3,
  },
  activeDot: {
    backgroundColor: '#ff8c52',
    width: 12,
    height: 12,
    borderRadius: 6,
    marginLeft: 3,
    marginRight: 3,
    marginTop: 3,
    marginBottom: 3,
  },
  buttonContainer: {
    flex: 2,
    justifyContent: 'flex-end',
    paddingBottom: 40,
    paddingHorizontal: 20,
  },
  button: {
    backgroundColor: '#ff8c52',
    borderRadius: 8,
    height: 50,
    marginBottom: 15,
  },
  lecbutton: {
    backgroundColor: '#e07b48',
    borderRadius: 8,
    height: 50,
    marginBottom: 15,
  },
  buttonTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  loginButtonTitle: {
    color: '#ff8c52',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default SigninWelcomeScreen;
