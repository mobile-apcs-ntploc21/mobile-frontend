import { View, Text } from 'react-native';
import React from 'react';
import { fonts } from '@/constants/theme';
import MyText from '@/components/MyText';
import { TextStyles } from '@/styles/TextStyles';
import MyButton from '@/components/MyButton';
import Accordion from '@/components/Accordion';

const Playground = () => {
  return (
    <View>
      <MyText style={TextStyles.h1}>Heading 1</MyText>
      <MyText style={TextStyles.h2}>Heading 2</MyText>
      <MyText style={TextStyles.h3}>Heading 3</MyText>
      <MyText style={TextStyles.bodyXL}>Body XL</MyText>
      <MyText>Body L</MyText>
      <MyButton onPress={() => console.log('Default button')}>
        <MyText>Default button</MyText>
      </MyButton>
      <MyButton
        onPress={() => console.log('Custom button')}
        style={{ width: 300, height: 100, backgroundColor: 'plum' }}
      >
        <MyText>Custom button</MyText>
      </MyButton>
      <Accordion>
        {Array.from({ length: 10 }, (_, index) => (
          <MyText key={index}>Content {index}</MyText>
        ))}
      </Accordion>
    </View>
  );
};

export default Playground;
