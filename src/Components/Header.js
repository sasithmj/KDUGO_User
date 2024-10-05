// header.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { colors, parameters } from '../global/styles';
import { Icon } from 'react-native-elements';
import AntDesign from 'react-native-vector-icons/AntDesign';

export default function Header({ title, type }) {
  const navigation = useNavigation();
  return (
    <View style={styles.header}>
      <View>
        <Icon
          type="material-community"
          name={type}
          color={colors.headerText}
          size={28}
          onPress={() => {
            navigation.navigate("SigninWelcomeScreen");
          }}
        />
        <AntDesign name='left' style={{ color: 'black', marginLeft: 5 }} />
      </View>
      <Text style={styles.headerText}>{title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    backgroundColor: colors.buttons,
    height: parameters.headerHeight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerText: {
    color: colors.headerText,
    fontSize: 18,
    fontWeight: 'bold',
  },
});
