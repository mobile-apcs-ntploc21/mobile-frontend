import { StyleSheet, TextStyle, View } from 'react-native';
import React from 'react';
import MyButtonBase, { MyButtonBaseProps } from './MyButtonBase';
import MyText from '../MyText';
import { colors, fonts } from '@/constants/theme';
import { IconProps } from '@/types';
import IconWithSize from '../IconWithSize';

interface MyButtonTextIconProps extends MyButtonBaseProps {
  title: string;
  iconBefore?: React.ComponentType<IconProps>;
  iconAfter?: React.ComponentType<IconProps>;
  gap?: number;
}

const MyButtonTextIcon = (props: MyButtonTextIconProps) => {
  const { backgroundColor = colors.primary, textColor = colors.white, gap = 8 } = props;
  const combinedStyles: TextStyle = StyleSheet.flatten([
    styles.text,
    { color: props.reverseStyle ? backgroundColor : textColor },
    props.textStyle
  ]);
  return (
    <MyButtonBase {...props} {...{ backgroundColor, textColor }}>
      <View style={[styles.textContainer, { gap }]}>
        {props.iconBefore && (
          <IconWithSize
            icon={props.iconBefore}
            color={props.reverseStyle ? backgroundColor : textColor}
            size={combinedStyles.lineHeight || 24}
          />
        )}
        <MyText style={combinedStyles}>{props.title}</MyText>
        {props.iconAfter && (
          <IconWithSize
            icon={props.iconAfter}
            color={props.reverseStyle ? backgroundColor : textColor}
            size={combinedStyles.lineHeight || 24}
          />
        )}
      </View>
    </MyButtonBase>
  );
};

export default MyButtonTextIcon;

const styles = StyleSheet.create({
  text: {
    fontSize: 24,
    fontFamily: fonts.bold
  },
  textContainer: {
    flexDirection: 'row',
    alignItems: 'center'
  }
});
