import {
  StyleSheet,
  TouchableOpacity,
  TouchableOpacityProps
} from 'react-native';
import React from 'react';
import { rH, rW } from '@/styles/reponsive';
import { colors } from '@/constants/theme';

/**
 * MyButtonBase component wraps TouchableOpacity with default style
 * @param props TouchableOpacityProps
 * @returns React.FC
 */
const MyButtonBase = (props: TouchableOpacityProps) => {
  const combinedStyles = StyleSheet.flatten([styles.container, props.style]);
  return <TouchableOpacity {...props} style={combinedStyles} />;
};

export default MyButtonBase;

const styles = StyleSheet.create({
  container: {
    width: rW(100),
    height: rH(50),
    backgroundColor: colors.primary,
    borderRadius: 999,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: rW(8),
    paddingVertical: rH(4)
  }
});
