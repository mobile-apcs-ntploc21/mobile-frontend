import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { IconProps } from '@/types';

interface IconWithSizeProps extends IconProps {
  icon: React.ComponentType<IconProps>;
  size: number;
}
const IconWithSize = (props: IconWithSizeProps) => {
  return (
    <View style={{ width: props.size, height: props.size }}>
      <props.icon {...props} />
    </View>
  );
};

export default IconWithSize;

const styles = StyleSheet.create({});
