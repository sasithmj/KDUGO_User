import React, {createContext, useState, useContext, useEffect} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import firestore from '@react-native-firebase/firestore';

const NotificationContext = createContext();

export const useNotification = () => useContext(NotificationContext);

export const NotificationProvider = ({children}) => {
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    let initialLoadComplete = false;

    const loadUnreadCount = async () => {
      try {
        const storedCount = await AsyncStorage.getItem('unreadCount');
        if (storedCount !== null) {
          setUnreadCount(parseInt(storedCount, 10));
        }
      } catch (error) {
        console.error('Error loading unread count:', error);
      }
    };

    loadUnreadCount();

    const unsubscribe = firestore()
      .collection('Notices')
      .orderBy('date', 'desc')
      .onSnapshot(async querySnapshot => {
        if (!initialLoadComplete) {
          initialLoadComplete = true;
          return; // Skip the initial load
        }

        const lastSeenTimestamp = await AsyncStorage.getItem(
          'lastSeenTimestamp',
        );
        const parsedLastSeenTimestamp = lastSeenTimestamp
          ? new Date(lastSeenTimestamp)
          : null;

        let newUnreadCount = unreadCount;

        querySnapshot.docChanges().forEach(change => {
          if (change.type === 'added') {
            const newNotification = change.doc.data();
            const newNotificationTimestamp = newNotification.date.toDate();

            if (
              !parsedLastSeenTimestamp ||
              newNotificationTimestamp > parsedLastSeenTimestamp
            ) {
              newUnreadCount++;
            }
          }
        });

        if (newUnreadCount !== unreadCount) {
          updateUnreadCount(newUnreadCount);
        }
      });

    return () => unsubscribe();
  }, [unreadCount]);

  const updateUnreadCount = async count => {
    setUnreadCount(count);
    try {
      await AsyncStorage.setItem('unreadCount', count.toString());
    } catch (error) {
      console.error('Error saving unread count:', error);
    }
  };

  const markAllAsRead = async () => {
    updateUnreadCount(0);
    const latestNotification = await firestore()
      .collection('Notices')
      .orderBy('date', 'desc')
      .limit(1)
      .get();

    if (!latestNotification.empty) {
      const latestTimestamp = latestNotification.docs[0].data().date.toDate();
      await AsyncStorage.setItem(
        'lastSeenTimestamp',
        latestTimestamp.toISOString(),
      );
    }
  };

  const decrementUnreadCount = () => {
    if (unreadCount > 0) {
      updateUnreadCount(unreadCount - 1);
    }
  };

  return (
    <NotificationContext.Provider
      value={{
        unreadCount,
        updateUnreadCount,
        markAllAsRead,
        decrementUnreadCount,
      }}>
      {children}
    </NotificationContext.Provider>
  );
};
