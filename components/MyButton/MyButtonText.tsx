import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import MyButtonBase, { MyButtonBaseProps } from './MyButtonBase';
import MyText from '../MyText';
import { TextStyles } from '@/styles/TextStyles';
import { colors, fonts } from '@/constants/theme';
import { rMS } from '@/styles/responsive';

interface MyButtonTextProps extends MyButtonBaseProps {
  title: string;
}

const MyButtonText = ({
  title,
  textStyle,
  ...restProps
}: MyButtonTextProps) => {
  const combinedStyles = StyleSheet.flatten([styles.text, textStyle]);
  return (
    <MyButtonBase {...restProps}>
      <MyText style={combinedStyles}>{title}</MyText>
    </MyButtonBase>
  );
};

export default MyButtonText;

const styles = StyleSheet.create({
  text: {
    fontSize: rMS(24),
    fontFamily: fonts.bold,
    color: colors.white
  }
});
