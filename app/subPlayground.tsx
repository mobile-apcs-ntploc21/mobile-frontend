import {
  FlatList,
  KeyboardAvoidingView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import React, { useLayoutEffect, useState } from 'react';
import { useNavigation } from 'expo-router';
import MyHeader from '@/components/MyHeader';
import MyText from '@/components/MyText';
import { TextStyles } from '@/styles/TextStyles';
import { NativeStackHeaderProps } from '@react-navigation/native-stack';
import GlobalStyles from '@/styles/GlobalStyles';
import { TextInput } from 'react-native-gesture-handler';
import ChatInput from '@/components/Chat/ChatInput';

const subPlayground = () => {
  const navigation = useNavigation();
  const [text, setText] = useState('');

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
    <KeyboardAvoidingView style={GlobalStyles.screen}>
      <FlatList
        keyboardShouldPersistTaps="always"
        data={Array.from({ length: 100 })}
        renderItem={({ item, index }) => (
          <View>
            <MyText style={TextStyles.h3}>Hello, World! {index}</MyText>
          </View>
        )}
        inverted
      />
      <ChatInput
        value={text}
        onChange={setText}
        mentions={['nhanbin03', 'role 1', 'role 1 lorem ipsum']}
        emojis={['kekw', 'pepega', 'pog']}
      />
    </KeyboardAvoidingView>
  );
};

export default subPlayground;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column-reverse'
  }
});
