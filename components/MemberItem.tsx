import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import MyText from './MyText';
import { colors, fonts } from '@/constants/theme';

const MemberItem = () => {
  return (
    <View style={styles.container}>
      <View style={styles.avatar}></View>
      <View style={styles.info}>
        <MyText style={styles.nickname}>User</MyText>
        <MyText style={styles.username}>@username</MyText>
      </View>
    </View>
  );
};

export default MemberItem;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    columnGap: 12,
    alignItems: 'center'
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.gray03
  },
  nickname: {
    fontSize: 12,
    fontFamily: fonts.bold
  },
  username: {
    fontSize: 10
  },
  info: {
    rowGap: 4
  }
});
