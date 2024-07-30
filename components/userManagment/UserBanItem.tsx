import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import MyText from '../MyText';
import { colors, fonts } from '@/constants/theme';

const UserBanItem = () => {
  return (
    <View style={styles.container}>
      <View style={styles.avatar}></View>
      <MyText style={styles.username}>username</MyText>
    </View>
  );
};

export default UserBanItem;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    columnGap: 16,
    alignItems: 'center'
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.gray03
  },
  username: {
    fontSize: 14,
    fontFamily: fonts.bold
  }
});
