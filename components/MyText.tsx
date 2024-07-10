import { StyleSheet, Text, TextProps, View } from 'react-native';
import React from 'react';
import { TextStyles } from '@/styles/TextStyles';
import { colors } from '@/constants/theme';

const MyText = (props: TextProps) => {
  return (
    <Text style={{ ...TextStyles.bodyL, color: colors.black }} {...props} />
  );
};

export default MyText;

const styles = StyleSheet.create({});
