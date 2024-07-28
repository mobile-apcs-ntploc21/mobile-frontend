import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import MyText from './MyText';
import { fonts } from '@/constants/theme';

const MemberItem = () => {
  return (
    <View style={styles.container}>
      <View style={styles.avatar}></View>
      <View>
        <MyText style={styles.nickname}>Nickname</MyText>
        <MyText style={styles.username}>User name</MyText>
      </View>
    </View>
  );
};

export default MemberItem;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    columnGap: 12
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'gray'
  },
  nickname: {
    fontSize: 12,
    fontFamily: fonts.bold
  },
  username: {
    fontSize: 10
  }
});
