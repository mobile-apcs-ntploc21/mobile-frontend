import { Image, StyleSheet, Text, View } from 'react-native';
import React, { useCallback, useMemo } from 'react';
import BaseChatItem, { ChatItemProps } from './BaseChatItem';
import { colors, fonts } from '@/constants/theme';
import useServerParseContent from '@/hooks/useServerParseContent';
import useServer from '@/hooks/useServer';
import useServers from '@/hooks/useServers';
import { useUserContext } from '@/context/UserProvider';
import { useUserById } from '@/hooks/useUserById';
import { UserProfile } from '@/types';

interface DMChatItemProps
  extends Omit<
    ChatItemProps,
    'displayedContents' | 'users' | 'parseContent' | 'emojis'
  > {
  users: UserProfile[];
}

const DMChatItem = (props: DMChatItemProps) => {
  const { emojiCategories } = useServers();
  const emojis = useMemo(
    () => emojiCategories.flatMap((category) => category.emojis),
    [emojiCategories]
  );
  const parseContent = useServerParseContent();

  return (
    <BaseChatItem
      {...props}
      users={props.users}
      parseContent={parseContent}
      emojis={emojis}
    />
  );
};

export default DMChatItem;

const styles = StyleSheet.create({
  highlightText: {
    color: colors.primary,
    backgroundColor: colors.tertiary,
    fontFamily: fonts.bold
  }
});
