import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { MyButtonBaseProps } from './MyButtonBase';

interface MyButtonPressProps {
  comp: React.FC<MyButtonBaseProps>;
}

const MyButtonPress = ({ comp: Comp }: MyButtonPressProps) => {
  const [reverse, setReverse] = React.useState(false);

  return (
    <Comp
      reverseStyle={reverse}
      onPressIn={() => setReverse(true)}
      onPressOut={() => setReverse(false)}
    />
  );
};

export default MyButtonPress;
