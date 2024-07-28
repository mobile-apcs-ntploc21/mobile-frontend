import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useState } from 'react';
import { colors } from '@/constants/theme';
import MyText from './MyText';
import { MaterialIcons } from '@expo/vector-icons';

interface CheckboxProps {
  value?: boolean;
  onChange?: (value: boolean) => void;
  outColor?: string;
  inColor?: string;
}

const Checkbox = ({
  value,
  onChange,
  inColor = colors.white,
  outColor = colors.primary
}: CheckboxProps) => {
  const [flag, setFlag] = useState(false);

  const isControlled = value !== undefined;

  const state = isControlled ? value : flag;

  const handlePress = () => {
    const newState = !state;
    if (isControlled && onChange) {
      // If controlled, invoke onChange
      onChange(newState);
    } else {
      // If uncontrolled, update internal state
      setFlag(newState);
    }
  };
  return (
    <TouchableOpacity
      style={[
        styles.container,
        {
          borderColor: outColor,
          backgroundColor: state ? outColor : 'transparent'
        }
      ]}
      onPress={handlePress}
    >
      {state && <MaterialIcons name="done" size={14} color={inColor} />}
    </TouchableOpacity>
  );
};

export default Checkbox;

const styles = StyleSheet.create({
  container: {
    width: 16,
    height: 16,
    borderRadius: 4,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center'
  }
});
