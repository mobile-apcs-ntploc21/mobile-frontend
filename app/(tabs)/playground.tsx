import { View, Text, ScrollView } from 'react-native';
import React from 'react';
import { colors, fonts } from '@/constants/theme';
import MyText from '@/components/MyText';
import { TextStyles } from '@/styles/TextStyles';
import { MyButtonText } from '@/components/MyButton';
import Accordion from '@/components/Accordion';
import { rH, rW } from '@/styles/responsive';
import Toggle from '@/components/Toggle';
import MyButtonIcon from '@/components/MyButton/MyButtonIcon';
import FriendIcon from '@/assets/icons/FriendIcon';
import MessageIcon from '@/assets/icons/MessageIcon';

const Playground = () => {
  return (
    <ScrollView>
      <MyText style={TextStyles.h1}>Heading 1</MyText>
      <MyText style={TextStyles.h2}>Heading 2</MyText>
      <MyText style={TextStyles.h3}>Heading 3</MyText>
      <MyText style={TextStyles.bodyXL}>Body XL</MyText>
      <MyText>Body L</MyText>
      <MyButtonText
        title="Default"
        onPress={() => console.log('Default')}
        style={{ alignSelf: 'center' }}
      />
      <MyButtonText
        title="Reverse Style"
        onPress={() => console.log('Reverse Style')}
        style={{ alignSelf: 'center' }}
        reverseStyle
      />
      <MyButtonText
        title="Custom button"
        onPress={() => console.log('Custom button')}
        containerStyle={{ width: '90%', height: 100, borderRadius: 10 }}
        backgroundColor="plum"
        textStyle={TextStyles.h1}
      />
      <View
        style={{ flexDirection: 'row', columnGap: 10, alignItems: 'center' }}
      >
        <MyButtonIcon icon={FriendIcon} />
        <MyButtonIcon
          icon={MessageIcon}
          containerStyle={{
            width: 26,
            height: 26,
            padding: 4
          }}
        />
      </View>
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
