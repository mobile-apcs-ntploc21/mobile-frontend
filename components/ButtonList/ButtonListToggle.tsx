import { StyleSheet, Text, TextStyle, View } from 'react-native';
import React, { useCallback, useEffect, useState } from 'react';
import ButtonListBase, { ButtonListBaseProps } from './ButtonListBase';
import MyText from '../MyText';
import { TextStyles } from '@/styles/TextStyles';
import IconWithSize from '../IconWithSize';
import TickIcon from '@/assets/icons/TickIcon';
import { colors } from '@/constants/theme';
import ToggleSwitch from 'toggle-switch-react-native';

interface ButtonListToggleItem {
  value: string;
  label?: string;
  isOn?: boolean;
  onChange?: (isOn: boolean) => void;
  labelStyle?: TextStyle;
}

interface ButtonListToggleProps extends Omit<ButtonListBaseProps, 'items'> {
  items?: ButtonListToggleItem[];
}

const ToggleItem = ({
  item,
  index
}: {
  item: ButtonListToggleItem;
  index: number;
}) => {
  const [isOn, setIsOn] = useState(item.isOn ?? false);
  return (
    <View style={styles.radioContainer} key={index}>
      <MyText style={[styles.label, item.labelStyle]}>{item.label}</MyText>
      <ToggleSwitch
        isOn={item.isOn ?? isOn}
        onColor={colors.primary}
        offColor={colors.gray03}
        size="medium"
        onToggle={(isOn: boolean) => {
          setIsOn(isOn);
          item.onChange?.(isOn);
        }}
      />
    </View>
  );
};

const ButtonListToggle = (props: ButtonListToggleProps) => {
  return (
    <ButtonListBase
      {...props}
      disabled
      items={props.items?.map((item, index) => ({
        itemComponent: <ToggleItem item={item} index={index} />
      }))}
    />
  );
};

export default ButtonListToggle;

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
