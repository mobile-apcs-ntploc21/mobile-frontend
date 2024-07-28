import { StyleSheet, Text, TouchableWithoutFeedback, View } from 'react-native';
import React from 'react';
import { colors } from '@/constants/theme';
import MyText from './MyText';
import GlobalStyles from '@/styles/GlobalStyles';
import { TextStyles } from '@/styles/TextStyles';
import { router } from 'expo-router';
import { Entypo } from '@expo/vector-icons';

export interface HeaderProps {
  title: string;
  rightComponent?: React.ReactNode;
}

const Header = (props: HeaderProps) => {
  return (
    <View style={styles.container}>
      <TouchableWithoutFeedback onPress={() => router.back()}>
        <Entypo name="chevron-thin-left" size={32} color={colors.black} />
      </TouchableWithoutFeedback>
      <MyText style={styles.title}>{props.title}</MyText>
      {props.rightComponent}
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({
  container: {
    ...GlobalStyles.container,
    flexDirection: 'row',
    alignItems: 'center',
    height: 72,
    backgroundColor: colors.white
  },
  title: {
    ...TextStyles.h2,
    marginLeft: 16,
    marginRight: 'auto'
  }
});
