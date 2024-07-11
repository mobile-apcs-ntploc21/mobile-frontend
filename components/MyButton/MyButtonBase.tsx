import {
  StyleSheet,
  TextProps,
  TextStyle,
  TouchableOpacity,
  TouchableOpacityProps,
  View,
  ViewStyle
} from 'react-native';
import React from 'react';
import { rH, rW } from '@/styles/responsive';
import { colors } from '@/constants/theme';

export interface MyButtonBaseProps extends TouchableOpacityProps {
  textStyle?: TextStyle;
  reverseStyle?: boolean;
  textColor?: string;
  backgroundColor?: string;
  containerStyle?: ViewStyle;
}

/**
 * MyButtonBase component wraps TouchableOpacity with default style
 * @param props TouchableOpacityProps
 * @returns React.FC
 */
const MyButtonBase = ({
  textColor,
  backgroundColor,
  reverseStyle,
  containerStyle,
  children
}: MyButtonBaseProps) => {
  const combinedStyles = StyleSheet.flatten([
    styles.container,
    {
      backgroundColor: reverseStyle ? textColor : backgroundColor,
      borderColor: reverseStyle ? backgroundColor : textColor,
      borderWidth: reverseStyle ? 1 : 0
    },
    containerStyle
  ]);
  return <TouchableOpacity style={combinedStyles}>{children}</TouchableOpacity>;
};

export default MyButtonBase;

const styles = StyleSheet.create({
  container: {
    width: rW(214),
    height: rH(50),
    borderRadius: 999,
    justifyContent: 'center',
    alignItems: 'center'
  }
});
