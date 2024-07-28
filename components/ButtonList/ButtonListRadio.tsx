import { StyleSheet, Text, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import ButtonListBase, { ButtonListBaseProps } from './ButtonListBase';
import MyText from '../MyText';
import { TextStyles } from '@/styles/TextStyles';
import IconWithSize from '../IconWithSize';
import TickIcon from '@/assets/icons/TickIcon';
import { colors } from '@/constants/theme';

interface ButtonListCheckboxProps extends Omit<ButtonListBaseProps, 'items'> {
  items?: {
    value: string;
    label?: string;
  }[];
  value?: string;
  onChange?: (value: string) => void;
}

const ButtonListRadio = (props: ButtonListCheckboxProps) => {
  return (
    <ButtonListBase
      {...props}
      items={props.items?.map((item, index) => ({
        itemComponent: (
          <View style={styles.radioContainer} key={index}>
            <MyText style={styles.label}>{item.label}</MyText>
            <IconWithSize
              icon={TickIcon}
              size={16}
              color={props.value === item.value ? colors.black : 'transparent'}
            />
          </View>
        ),
        onPress: () => {
          props.onChange?.(item.value); // this line causes delayed performance issues (?)
        }
      }))}
    />
  );
};

export default ButtonListRadio;

const styles = StyleSheet.create({
  radioContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  radio: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#000'
  },
  label: {
    ...TextStyles.bodyXL,
    marginLeft: 4
  }
});
