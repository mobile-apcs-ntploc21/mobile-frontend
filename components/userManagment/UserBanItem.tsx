import { StyleSheet, Text, View } from 'react-native';
import { Image } from 'expo-image';
import React from 'react';
import MyText from '../MyText';
import { colors, fonts } from '@/constants/theme';

interface UserBanItemProps {
  username?: string;
  display_name?: string;
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
      <View>
        <MyText style={styles.displayName}>
          {props.display_name ? props.display_name : 'display_name'}
        </MyText>
        <MyText style={styles.username}>
          {props.username ? `@${props.username}` : 'username'}
        </MyText>
      </View>
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
  displayName: {
    fontSize: 16,
    fontFamily: fonts.bold
  },
  username: {
    fontSize: 10,
    fontFamily: fonts.regular
  }
});
