import { StyleSheet, Text, View } from 'react-native';
import React, { useCallback, useEffect, useState } from 'react';
import ButtonListBase, { ButtonListBaseProps } from './ButtonListBase';
import MyText from '../MyText';
import { TextStyles } from '@/styles/TextStyles';
import IconWithSize from '../IconWithSize';
import TickIcon from '@/assets/icons/TickIcon';
import { colors } from '@/constants/theme';
import Checkbox from '../Checkbox';

interface ButtonListTextProps<T> extends Omit<ButtonListBaseProps, 'items'> {
  data: T[];
  values?: T[];
  onAdd?: (value: T) => void;
  onRemove?: (value: T) => void;
  labelExtractor: (item: T) => string;
  valueExtractor: (item: T) => any;
  keyExtractor: (item: T) => string;
  compareValues: (a: T, b: T) => boolean;
}

const ButtonListCheckbox = <T,>(props: ButtonListTextProps<T>) => {
  const handlePress = useCallback(
    (value: T) => {
      if (props.values?.includes(value)) props.onRemove?.(value);
      else props.onAdd?.(value);
    },
    [props.values, props.onAdd, props.onRemove]
  );
  return (
    <ButtonListBase
      {...props}
      items={props.data.map((item) => {
        return {
          itemComponent: (
            <View style={styles.radioContainer} key={props.keyExtractor(item)}>
              <MyText style={styles.label}>{props.labelExtractor(item)}</MyText>
              <Checkbox
                value={props.values?.some((sitem) =>
                  props.compareValues(
                    props.valueExtractor(sitem),
                    props.valueExtractor(item)
                  )
                )}
                onChange={() => handlePress(props.valueExtractor(item))}
              />
            </View>
          ),
          onPress: () => handlePress(props.valueExtractor(item))
        };
      })}
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
