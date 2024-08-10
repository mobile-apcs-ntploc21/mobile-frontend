import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useState } from 'react';
import { colors, fonts } from '@/constants/theme';
import { ServerItemProps } from '@/types';
import MyText from '../MyText';

interface ExtendServerItemProps extends ServerItemProps {}

const ExtendServerItem = (props: ExtendServerItemProps) => {
  return (
    <Pressable
      onPress={() => {
        props.onPress?.(props.id);
      }}
    >
      <View style={styles.container}>
        <View style={styles.serverImg} />
        <MyText style={styles.serverName}>Server {props.id}</MyText>
      </View>
    </Pressable>
  );
};

export default ExtendServerItem;

const styles = StyleSheet.create({
  container: {
    gap: 8
  },
  serverImg: {
    width: 64,
    height: 64,
    borderRadius: 64 / 2,
    backgroundColor: colors.gray02
  },
  serverName: {
    alignSelf: 'center',
    fontSize: 12,
    fontFamily: fonts.bold
  }
});
