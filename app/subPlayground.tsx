import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { useLayoutEffect } from 'react';
import { useNavigation } from 'expo-router';
import MyHeader from '@/components/MyHeader';
import MyText from '@/components/MyText';
import { TextStyles } from '@/styles/TextStyles';
import { NativeStackHeaderProps } from '@react-navigation/native-stack';

const subPlayground = () => {
  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({
      header: (props: NativeStackHeaderProps) => (
        <MyHeader
          {...props}
          title="Playground"
          headerRight={
            <TouchableOpacity
              onPress={() => console.log('Header right pressed')}
            >
              <MyText style={TextStyles.h3}>Button</MyText>
            </TouchableOpacity>
          }
        />
      )
    });
  });

  return (
    <View>
      <Text>subPlayground</Text>
    </View>
  );
};

export default subPlayground;

const styles = StyleSheet.create({});
