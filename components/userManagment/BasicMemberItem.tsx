import { Image, StyleSheet, Text, View } from 'react-native';
import React from 'react';
import MyText from '../MyText';
import { colors, fonts } from '@/constants/theme';
import { DefaultProfileImage } from '@/constants/images';
import { Member } from '@/types/server';

const BasicMemberItem = ({ member }: { member?: Member }) => {
  return (
    <View style={styles.container}>
      <Image
        source={member?.avatar ? { uri: member?.avatar } : DefaultProfileImage}
        style={styles.avatar}
      />
      <View style={styles.info}>
        <MyText style={styles.nickname}>{member?.display_name}</MyText>
        <MyText style={styles.username}>{`@${member?.username}`}</MyText>
      </View>
    </View>
  );
};

export default BasicMemberItem;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    columnGap: 12,
    alignItems: 'center'
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22
    // backgroundColor: colors.gray03
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
