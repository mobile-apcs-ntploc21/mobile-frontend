import {
  StyleSheet,
  TextProps,
  TextStyle,
  TouchableOpacity,
  TouchableOpacityProps,
  View
} from 'react-native';
import React from 'react';
import { rH, rW } from '@/styles/responsive';
import { colors } from '@/constants/theme';

export interface MyButtonBaseProps extends TouchableOpacityProps {
  textStyle?: TextStyle;
  reverseStyle?: boolean;
  textColor?: string;
  backgroundColor?: string;
  padding?: number;
}

/**
 * MyButtonBase component wraps TouchableOpacity with default style
 * @param props TouchableOpacityProps
 * @returns React.FC
 */
const MyButtonBase = (props: MyButtonBaseProps) => {
  const {
    textColor = colors.white,
    backgroundColor = colors.primary,
    reverseStyle,
    padding = 10
  } = props;
  const combinedStyles = StyleSheet.flatten([
    styles.container,
    {
      backgroundColor: reverseStyle ? textColor : backgroundColor,
      borderColor: reverseStyle ? backgroundColor : textColor,
      borderWidth: reverseStyle ? 1 : 0
    },
    props.style
  ]);
  return (
    <TouchableOpacity {...props} style={combinedStyles}>
      <View style={{ padding }}>{props.children}</View>
    </TouchableOpacity>
  );
};

export default MyButtonBase;

const styles = StyleSheet.create({
  container: {
    minWidth: rW(214),
    height: rH(50),
    borderRadius: 999,
    justifyContent: 'center',
    alignItems: 'center'
  }
});
