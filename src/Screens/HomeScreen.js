import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import {Icon} from 'react-native-elements';
import HomeHeader from '../Components/HomeHeader';
import {colors} from '../global/styles';
import {useNavigation} from '@react-navigation/native';

export default function HomeScreen() {
  const [delivery, setDelivery] = useState(true);
  const navigation = useNavigation();

  const MenuButton = ({title, iconName, onPress}) => (
    <TouchableOpacity style={styles.menuButton} onPress={onPress}>
      <Icon
        type="material-community"
        name={iconName}
        color={colors.primary}
        size={32}
      />
      <Text style={styles.menuButtonText}>{title}</Text>
    </TouchableOpacity>
  );

  const QRScanBanner = ({onScanPress}) => (
    <TouchableOpacity style={styles.qrBanner} onPress={onScanPress}>
      <View style={styles.qrTextContainer}>
        <Text style={styles.qrTitle}>Are you ready for a</Text>
        <Text style={styles.qrSubtitle}>Smooth ride?</Text>
        <Text style={styles.qrDescription}>
          Sit back, relax & enjoy the ride.
        </Text>
      </View>
      <View style={styles.qrIconContainer}>
        <Icon
          type="material-community"
          name="qrcode-scan"
          color={colors.black}
          size={32}
        />
        <TouchableOpacity style={styles.scanButton} onPress={onScanPress}>
          <Text style={styles.scanButtonText}>Scan</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  const handleScanPress = () => {
    // Implement QR code scanning functionality here
    console.log('Scan QR Code');
    navigation.navigate('qrscan');
    // You might want to navigate to a scanning screen or open a camera view
  };

  return (
    <SafeAreaView style={styles.container}>
      <HomeHeader />
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.deliveryButton, delivery && styles.activeButton]}
              onPress={() => {
                setDelivery(true);
                navigation.navigate('HomeSearch');
              }}>
              <Icon
                type="material-community"
                name="clock-fast"
                color={delivery ? colors.cardbackground : colors.grey2}
                size={24}
              />
              <Text
                style={[styles.deliveryText, delivery && styles.activeText]}>
                Live Scheduling
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.deliveryButton, !delivery && styles.activeButton]}
              onPress={() => {
                setDelivery(false);
                navigation.navigate('DestinationSearch');
              }}>
              <Icon
                type="material-community"
                name="calendar-clock"
                color={!delivery ? colors.cardbackground : colors.grey2}
                size={24}
              />
              <Text
                style={[styles.deliveryText, !delivery && styles.activeText]}>
                Scheduled Delivery
              </Text>
            </TouchableOpacity>
          </View>

          {/* <View style={styles.locationCard}>
            <View style={styles.locationInfo}>
              <Icon
                type="material-community"
                name="map-marker"
                color={colors.primary}
                size={26}
              />
              <Text style={styles.locationText}>KDU Southern Campus</Text>
            </View>
            <View style={styles.locationInfo}>
              <Icon
                type="material-community"
                name="clock-time-four"
                color={colors.primary}
                size={26}
              />
              <Text style={styles.locationText}>Now</Text>
            </View>
          </View> */}

          <QRScanBanner onScanPress={handleScanPress} />

          <View style={styles.menuGrid}>
            <MenuButton
              title="Tracking"
              iconName="map-marker-radius"
              onPress={() => navigation.navigate('indexScreen')}
            />
            <MenuButton
              title="Seat Reservation"
              iconName="seat-passenger"
              onPress={() => navigation.navigate('BookSeats')}
            />
            <MenuButton
              title="Lost and Found"
              iconName="magnify"
              onPress={() => navigation.navigate('newLost')}
            />
            <MenuButton
              title="Bus Scheduling"
              iconName="bus-clock"
              onPress={() => {}}
            />
            <MenuButton
              title="Details"
              iconName="inbox" // You can use any icon name from MaterialCommunityIcons
              onPress={() => navigation.navigate('Details')}
            />
            <MenuButton
              title="Emergency Details"
              iconName="alert-circle" // Changed to a valid icon name
              onPress={() => navigation.navigate('Emergency')}
            />
            <MenuButton
              title="FeedBack Details"
              iconName="alert-circle" // Changed to a valid icon name
              onPress={() => navigation.navigate('Emergency')}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  qrBanner: {
    flexDirection: 'row',
    backgroundColor: '#E5DCCB',
    borderRadius: 10,
    marginBottom: 16,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  qrTextContainer: {
    flex: 2,
    alignItems: 'flex-end',
  },
  qrTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.grey1,
  },
  qrSubtitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.primary,
    marginVertical: 4,
  },
  qrDescription: {
    fontSize: 14,
    color: colors.grey2,
  },
  qrIconContainer: {
    display: 'flex',
    flex: 1,
    alignItems: 'center',
  },
  scanButton: {
    backgroundColor: 'blue',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginTop: 8,
    width: '75%',
    display: 'flex',
    alignItems: 'center',
  },
  scanButtonText: {
    color: colors.cardbackground,
    fontWeight: 'bold',
  },
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 20,
  },
  deliveryButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 30,
    backgroundColor: colors.grey5,
    marginHorizontal: 5,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  activeButton: {
    backgroundColor: colors.buttons,
  },
  deliveryText: {
    fontSize: 16,
    color: colors.grey2,
    fontWeight: '500',
    marginLeft: 8,
  },
  activeText: {
    color: colors.cardbackground,
  },
  locationCard: {
    backgroundColor: colors.grey5,
    borderRadius: 15,
    padding: 16,
    marginBottom: 20,
  },
  locationInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  locationText: {
    marginLeft: 8,
    fontSize: 16,
    color: colors.grey1,
  },
  menuGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  menuButton: {
    width: '48%',
    backgroundColor: colors.cardbackground,
    borderRadius: 15,
    padding: 16,
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  menuButtonText: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: '500',
    color: colors.grey1,
    textAlign: 'center',
  },
});
