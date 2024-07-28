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
import { colors } from '@/constants/theme';

export interface MyButtonBaseProps extends TouchableOpacityProps {
  showOutline?: boolean;
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
const MyButtonBase = (props: MyButtonBaseProps) => {
  const {
    textColor,
    backgroundColor,
    reverseStyle,
    containerStyle,
    children,
    showOutline = true
  } = props;
  const combinedStyles = StyleSheet.flatten([
    styles.container,
    {
      backgroundColor: reverseStyle ? textColor : backgroundColor
    },
    showOutline
      ? {
          borderColor: reverseStyle ? backgroundColor : textColor,
          borderWidth: 1
        }
      : {},
    containerStyle
  ]);
  return (
    <TouchableOpacity {...props} style={combinedStyles}>
      {children}
    </TouchableOpacity>
  );
};

export default MyButtonBase;

const styles = StyleSheet.create({
  container: {
    width: 214,
    height: 50,
    borderRadius: 999,
    justifyContent: 'center',
    alignItems: 'center'
  }
});
