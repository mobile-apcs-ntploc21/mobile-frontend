import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { colors, fonts } from '@/constants/theme';

interface StatusBubbleProps {
  emoji?: string;
  text?: string;
}

const StatusBubble = ({ emoji, text }: StatusBubbleProps) => {
  return (
    <View style={styles.container}>
      <View style={styles.textContainer}>
        <Text style={styles.text}>{`${emoji} ${text}`}</Text>
      </View>
      <View style={styles.bubble1} />
      <View style={styles.bubble2} />
    </View>
  );
};

export default StatusBubble;

const styles = StyleSheet.create({
  container: {
    width: '100%'
  },
  textContainer: {
    marginLeft: 8,
    marginTop: 8,
    backgroundColor: colors.gray03,
    borderRadius: 28,
    padding: 20
  },
  text: {
    fontSize: 20,
    fontFamily: fonts.regular,
    color: colors.black
  },
  bubble1: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.gray03,
    position: 'absolute',
    top: 0,
    left: 0
  },
  bubble2: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: colors.gray03,
    position: 'absolute',
    top: 12,
    left: 4
  }
});