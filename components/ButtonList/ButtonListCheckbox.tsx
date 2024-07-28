import { StyleSheet, Text, View } from 'react-native';
import React, { useCallback, useEffect, useState } from 'react';
import ButtonListBase, { ButtonListBaseProps } from './ButtonListBase';
import MyText from '../MyText';
import { TextStyles } from '@/styles/TextStyles';
import IconWithSize from '../IconWithSize';
import TickIcon from '@/assets/icons/TickIcon';
import { colors } from '@/constants/theme';
import Checkbox from '../Checkbox';

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
  const handlePress = useCallback(
    (value: string) => {
      if (props.values?.includes(value)) props.onRemove?.(value);
      else props.onAdd?.(value);
    },
    [props.values, props.onAdd, props.onRemove]
  );
  return (
    <ButtonListBase
      {...props}
      items={props.items?.map((item, index) => ({
        itemComponent: (
          <View style={styles.radioContainer} key={index}>
            <MyText style={styles.label}>{item.label}</MyText>
            <Checkbox
              value={props.values?.includes(item.value)}
              onChange={() => handlePress(item.value)}
            />
          </View>
        ),
        onPress: () => handlePress(item.value)
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
