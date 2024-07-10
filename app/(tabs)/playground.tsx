import { View, Text } from 'react-native';
import React from 'react';
import { fonts } from '@/constants/theme';
import MyText from '@/components/MyText';
import { TextStyles } from '@/styles/TextStyles';

const Playground = () => {
  return (
    <View>
      <MyText style={TextStyles.h1}>Heading 1</MyText>
      <MyText style={TextStyles.h2}>Heading 2</MyText>
      <MyText style={TextStyles.h3}>Heading 3</MyText>
      <MyText style={TextStyles.bodyXL}>Body XL</MyText>
      <MyText>Body L</MyText>
    </View>
  );
};

export default Playground;
