import { StyleSheet, Text, View } from 'react-native';
import { Image } from 'expo-image';
import React from 'react';
import MyText from '../MyText';
import { colors, fonts } from '@/constants/theme';

interface UserBanItemProps {
  username?: string;
  avatarUri?: string;
}

const UserBanItem = (props: UserBanItemProps) => {
  return (
    <View style={styles.container}>
      {props.avatarUri ? (
        <Image source={{ uri: props.avatarUri }} style={styles.avatar} />
      ) : (
        <View style={styles.avatar} />
      )}
      <MyText style={styles.username}>
        {props.username ? props.username : 'username placeholder'}
      </MyText>
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
