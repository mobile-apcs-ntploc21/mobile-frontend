import {
  StyleSheet,
  TextProps,
  TextStyle,
  TouchableOpacity,
  TouchableOpacityProps
} from 'react-native';
import React from 'react';
import { rH, rW } from '@/styles/responsive';
import { colors } from '@/constants/theme';

export interface MyButtonBaseProps extends TouchableOpacityProps {
  textStyle?: TextStyle;
}

/**
 * MyButtonBase component wraps TouchableOpacity with default style
 * @param props TouchableOpacityProps
 * @returns React.FC
 */
const MyButtonBase = (props: MyButtonBaseProps) => {
  const combinedStyles = StyleSheet.flatten([styles.container, props.style]);
  return <TouchableOpacity {...props} style={combinedStyles} />;
};

export default MyButtonBase;

const styles = StyleSheet.create({
  container: {
    minWidth: rW(214),
    height: rH(50),
    backgroundColor: colors.primary,
    borderRadius: 999,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: rW(8),
    paddingVertical: rH(4)
  }
});
