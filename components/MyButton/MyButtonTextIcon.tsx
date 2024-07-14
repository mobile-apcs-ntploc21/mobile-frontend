import { StyleSheet, Text, TextStyle, View } from 'react-native';
import React from 'react';
import MyButtonBase, { MyButtonBaseProps } from './MyButtonBase';
import MyText from '../MyText';
import { TextStyles } from '@/styles/TextStyles';
import { colors, fonts } from '@/constants/theme';
import { IconProps } from '@/types';
import IconWithSize from '../IconWithSize';

interface MyButtonTextIconProps extends MyButtonBaseProps {
  title: string;
  iconBefore?: React.ComponentType<IconProps>;
  iconAfter?: React.ComponentType<IconProps>;
}

const MyButtonTextIcon = (props: MyButtonTextIconProps) => {
  const { backgroundColor = colors.primary, textColor = colors.white } = props;
  const combinedStyles: TextStyle = StyleSheet.flatten([
    styles.text,
    { color: props.reverseStyle ? backgroundColor : textColor },
    props.textStyle
  ]);
  return (
    <MyButtonBase {...props} {...{ backgroundColor, textColor }}>
      <View style={styles.textContainer}>
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
    alignItems: 'center',
    gap: 8
  }
});
