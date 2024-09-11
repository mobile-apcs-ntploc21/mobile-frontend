import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { Message } from '@/types/chat';

interface ChatItemProps {
  message: Message;
}

const ChatItem = (props: ChatItemProps) => {
  return (
    <View>
      <Text>{props.message.content}</Text>
    </View>
  );
};

export default ChatItem;

const styles = StyleSheet.create({});
