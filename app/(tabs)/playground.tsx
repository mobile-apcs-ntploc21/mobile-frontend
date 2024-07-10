import { View, Text, ScrollView } from 'react-native';
import React from 'react';
import { colors, fonts } from '@/constants/theme';
import MyText from '@/components/MyText';
import { TextStyles } from '@/styles/TextStyles';
import MyButton from '@/components/MyButton';
import Accordion from '@/components/Accordion';
import { rH, rW } from '@/styles/reponsive';
import Toggle from '@/components/Toggle';

const Playground = () => {
  return (
    <ScrollView>
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
        <View style={{ rowGap: rH(10) }}>
          {Array.from({ length: 20 }, (_, index) => (
            <View
              key={index}
              style={{ flexDirection: 'row', alignItems: 'center' }}
            >
              <View
                style={{
                  width: rW(45),
                  height: rH(45),
                  borderRadius: rW(45) / 2,
                  backgroundColor: colors.gray01
                }}
              />
              <MyText>User {index}</MyText>
            </View>
          ))}
        </View>
      </Accordion>
      <Toggle
        FirstFC={({ isSelected }) => (
          <MyText
            style={{
              color: isSelected ? colors.white : colors.primary
            }}
          >
            Default
          </MyText>
        )}
        SecondFC={({ isSelected }) => (
          <MyText
            style={{
              color: isSelected ? colors.white : colors.primary
            }}
          >
            Toggle
          </MyText>
        )}
      />
      <Toggle
        backgroundColor="plum"
        FirstFC={({ isSelected }) => (
          <MyText
            style={{
              color: isSelected ? colors.white : 'blue'
            }}
          >
            Custom
          </MyText>
        )}
        SecondFC={({ isSelected }) => (
          <MyText
            style={{
              color: isSelected ? colors.white : 'blue'
            }}
          >
            Toggle
          </MyText>
        )}
      />
    </ScrollView>
  );
};

export default Playground;
