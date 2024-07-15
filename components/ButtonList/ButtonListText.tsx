import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import ButtonListBase, { ButtonListBaseProps } from './ButtonListBase';
import MyText from '../MyText';
import { TextStyles } from '@/styles/TextStyles';

interface ButtonListTextProps extends Omit<ButtonListBaseProps, 'items'> {
  items?: {
    text: string;
    onPress?: () => void;
  }[];
}

const ButtonListText = (props: ButtonListTextProps) => {
  return (
    <ButtonListBase
      {...props}
      items={props.items?.map((item, index) => ({
        itemComponent: (
          <MyText key={index} style={styles.text}>
            {item.text}
          </MyText>
        ),
        onPress: item.onPress
      }))}
    />
  );
};

export default ButtonListText;

const styles = StyleSheet.create({
  text: {
    ...TextStyles.bodyXL,
    marginLeft: 4
  }
});
