import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import messaging from '@react-native-firebase/messaging';
import {useNotification} from '../../navigation/NotificationContext';
import Icon from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const NotificationItem = ({item, onPress}) => (
  <TouchableOpacity
    style={[styles.card, item.isRead ? styles.readCard : styles.unreadCard]}
    onPress={() => onPress(item)}>
    <View style={styles.iconContainer}>
      <Icon
        name={item.isRead ? 'notifications' : 'notifications-outline'}
        size={24}
        color={item.isRead ? '#999' : '#ff8c52'}
      />
    </View>
    <View style={styles.contentContainer}>
      <Text style={styles.title} numberOfLines={1}>
        {item.title || 'Notification'}
      </Text>
      <Text style={styles.noticeText} numberOfLines={2}>
        {item.notice}
      </Text>
      <Text style={styles.dateText}>
        {new Date(item.date.seconds * 1000).toLocaleString()}
      </Text>
    </View>
    {!item.isRead && <View style={styles.unreadIndicator} />}
  </TouchableOpacity>
);

const Notifications = () => {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const {updateUnreadCount, decrementUnreadCount, markAllAsRead} =
    useNotification();

  const getReadNotifications = async () => {
    try {
      const readNotifications = await AsyncStorage.getItem('readNotifications');
      return readNotifications ? JSON.parse(readNotifications) : {};
    } catch (error) {
      console.error('Error getting read notifications:', error);
      return {};
    }
  };

  const setReadNotification = async notificationId => {
    try {
      const readNotifications = await getReadNotifications();
      readNotifications[notificationId] = true;
      await AsyncStorage.setItem(
        'readNotifications',
        JSON.stringify(readNotifications),
      );
    } catch (error) {
      console.error('Error setting read notification:', error);
    }
  };

  const fetchNotifications = async () => {
    try {
      const querySnapshot = await firestore()
        .collection('Notices')
        .orderBy('date', 'desc')
        .get();
      const readNotifications = await getReadNotifications();
      const notices = querySnapshot.docs.map(doc => ({
        ...doc.data(),
        key: doc.id,
        isRead: readNotifications[doc.id] || false,
      }));
      setNotifications(notices);
      updateUnreadCount(notices.filter(notice => !notice.isRead).length);
    } catch (error) {
      console.error('Error fetching notifications:', error);
      Alert.alert('Error', 'Failed to load notifications. Please try again.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    const unsubscribe = firestore()
      .collection('Notices')
      .orderBy('date', 'desc')
      .onSnapshot(
        async querySnapshot => {
          const readNotifications = await getReadNotifications();
          const notices = querySnapshot.docs.map(doc => ({
            ...doc.data(),
            key: doc.id,
            isRead: readNotifications[doc.id] || false,
          }));
          setNotifications(notices);
          updateUnreadCount(notices.filter(notice => !notice.isRead).length);
        },
        error => {
          console.error('Error fetching notifications:', error);
          Alert.alert(
            'Error',
            'Failed to load notifications. Please try again.',
          );
        },
      );
    setLoading(false);
    setRefreshing(false);

    return () => unsubscribe(); // Clean up the listener when the component unmounts
  }, []);

  const markAsRead = async notification => {
    if (notification.isRead) return;

    try {
      await setReadNotification(notification.key);
      setNotifications(prevNotifications =>
        prevNotifications.map(notice =>
          notice.key === notification.key ? {...notice, isRead: true} : notice,
        ),
      );
      decrementUnreadCount();
    } catch (error) {
      console.error('Error marking notification as read:', error);
      Alert.alert(
        'Error',
        'Failed to mark notification as read. Please try again.',
      );
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await markAllAsRead();
      setNotifications(prevNotifications =>
        prevNotifications.map(notice => ({...notice, isRead: true})),
      );
      updateUnreadCount(0);
      await AsyncStorage.setItem(
        'readNotifications',
        JSON.stringify(
          Object.fromEntries(notifications.map(notice => [notice.key, true])),
        ),
      );
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      Alert.alert(
        'Error',
        'Failed to mark all notifications as read. Please try again.',
      );
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchNotifications();
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#ff8c52" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Notifications</Text>
        <TouchableOpacity
          onPress={handleMarkAllAsRead}
          style={styles.markAllButton}>
          <Icon name="checkmark-done-outline" size={24} color="#ff8c52" />
        </TouchableOpacity>
      </View>
      <FlatList
        data={notifications}
        renderItem={({item}) => (
          <NotificationItem item={item} onPress={markAsRead} />
        )}
        keyExtractor={item => item.key}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#ff8c52']}
          />
        }
        ListEmptyComponent={
          <Text style={styles.emptyText}>No notifications at the moment.</Text>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  markAllButton: {
    padding: 8,
  },
  card: {
    flexDirection: 'row',
    padding: 16,
    marginBottom: 1,
    backgroundColor: '#fff',
  },
  readCard: {
    opacity: 0.7,
  },
  unreadCard: {
    backgroundColor: '#fff',
  },
  iconContainer: {
    marginRight: 16,
    justifyContent: 'center',
  },
  contentContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  noticeText: {
    fontSize: 14,
    color: '#333',
    marginBottom: 4,
  },
  dateText: {
    fontSize: 12,
    color: '#999',
  },
  unreadIndicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#ff8c52',
    alignSelf: 'center',
    marginLeft: 8,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 16,
    color: '#999',
  },
});

export default Notifications;
