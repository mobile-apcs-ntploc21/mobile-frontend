import { Image, StyleSheet, Text, View } from 'react-native';
import React, { useCallback, useMemo } from 'react';
import BaseChatItem, { ChatItemProps } from './BaseChatItem';
import { colors, fonts } from '@/constants/theme';
import useServerParseContent from '@/hooks/useServerParseContent';
import useServer from '@/hooks/useServer';

interface ServerChatItemProps
  extends Omit<
    ChatItemProps,
    'displayedContents' | 'users' | 'parseContent' | 'emojis'
  > {}

const ServerChatItem = (props: ServerChatItemProps) => {
  const { members, emojis } = useServer();
  const parseContent = useServerParseContent();

  return (
    <BaseChatItem
      {...props}
      users={members}
      parseContent={parseContent}
      emojis={emojis}
    />
  );
};

export default ServerChatItem;

const styles = StyleSheet.create({
  highlightText: {
    color: colors.primary,
    backgroundColor: colors.tertiary,
    fontFamily: fonts.bold
  }
});
