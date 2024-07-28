import { StyleSheet, Text, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import ButtonListBase, { ButtonListBaseProps } from './ButtonListBase';
import MyText from '../MyText';
import { TextStyles } from '@/styles/TextStyles';
import IconWithSize from '../IconWithSize';
import TickIcon from '@/assets/icons/TickIcon';
import { colors } from '@/constants/theme';

interface ButtonListTextProps extends Omit<ButtonListBaseProps, 'items'> {
  items?: {
    value: string;
    label?: string;
  }[];
  values?: string[];
  onAdd?: (value: string) => void;
  onRemove?: (value: string) => void;
}

const ButtonListCheckbox = (props: ButtonListTextProps) => {
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
              color={
                props.values?.includes(item.value)
                  ? colors.black
                  : 'transparent'
              }
            />
          </View>
        ),
        onPress: () => {
          if (props.values?.includes(item.value)) props.onRemove?.(item.value);
          else props.onAdd?.(item.value);
        }
      }))}
    />
  );
};

export default ButtonListCheckbox;

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
