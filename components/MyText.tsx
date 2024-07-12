import { StyleSheet, Text, TextProps, View } from 'react-native';
import React from 'react';
import { TextStyles } from '@/styles/TextStyles';
import { colors } from '@/constants/theme';

/**
 * MyText component wraps Text with default fonts
 * @param props TextProps
 * @returns React.FC
 */
const MyText = (props: TextProps) => {
  return (
    <Text style={{ ...TextStyles.bodyL, color: colors.black }} {...props} />
  );
};

export default MyText;

const styles = StyleSheet.create({});
