import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import BaseChatInput, { BaseChatInputProps } from './BaseChatInput';

interface ServerChatInputProps
  extends Omit<BaseChatInputProps, 'mentions' | 'emojis' | 'channels'> {}

const ServerChatInput = (props: ServerChatInputProps) => {
  return <BaseChatInput {...props} />;
};

export default ServerChatInput;

const styles = StyleSheet.create({});
