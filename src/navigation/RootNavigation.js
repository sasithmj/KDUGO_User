import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import AuthStack from './authnavigators';
import {NotificationProvider} from './NotificationContext';

export default function RootNavigation() {
  return (
    <NotificationProvider>
      <NavigationContainer>
        <AuthStack />
      </NavigationContainer>
    </NotificationProvider>
  );
}
