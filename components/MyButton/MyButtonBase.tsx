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
  const { textColor, backgroundColor, reverseStyle, containerStyle, children } =
    props;
  const combinedStyles = StyleSheet.flatten([
    styles.container,
    {
      backgroundColor: reverseStyle ? textColor : backgroundColor,
      borderColor: reverseStyle ? backgroundColor : textColor
    },
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
    alignItems: 'center',
    borderWidth: 1
  }
});
