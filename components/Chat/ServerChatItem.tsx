import { Image, StyleSheet, Text, View } from 'react-native';
import React, { useCallback, useMemo } from 'react';
import BaseChatItem, { ChatItemProps } from './BaseChatItem';
import { colors, fonts } from '@/constants/theme';
import useServerParseContent from '@/hooks/useServerParseContent';

interface ServerChatItemProps
  extends Omit<ChatItemProps, 'displayedContents'> {}

const ServerChatItem = (props: ServerChatItemProps) => {
  const parseContent = useServerParseContent();

  return (
    <BaseChatItem
      {...props}
      displayedContents={parseContent(props.message.content)}
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
