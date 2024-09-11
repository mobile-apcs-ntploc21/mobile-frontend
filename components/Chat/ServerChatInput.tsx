import { StyleSheet, Text, View } from 'react-native';
import React, { useMemo } from 'react';
import BaseChatInput, { BaseChatInputProps } from './BaseChatInput';
import useServer from '@/hooks/useServer';

interface ServerChatInputProps
  extends Omit<BaseChatInputProps, 'mentions' | 'emojis' | 'channels'> {}

const ServerChatInput = (props: ServerChatInputProps) => {
  const { emojis, members, roles, categories } = useServer();
  const channels = useMemo(() => {
    return categories.map((category) => category.channels).flat();
  }, [categories]);
  return (
    <BaseChatInput
      {...props}
      // mentions both members and roles
      mentions={[
        ...members.map((member) => member.username),
        ...roles.map((role) => (role.default ? 'everyone' : role.name))
      ]}
      emojis={emojis.map((emoji) => emoji.name)}
      channels={channels.map((channel) => channel.name)}
    />
  );
};

export default ServerChatInput;

const styles = StyleSheet.create({});
