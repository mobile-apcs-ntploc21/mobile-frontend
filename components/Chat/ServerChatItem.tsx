import { Image, StyleSheet, Text, View } from 'react-native';
import React, { useCallback, useMemo } from 'react';
import { Message } from '@/types/chat';
import BaseChatItem, { ChatItemProps } from './BaseChatItem';
import useServer from '@/hooks/useServer';
import { colors, fonts } from '@/constants/theme';
import {
  TouchableHighlight,
  TouchableOpacity
} from 'react-native-gesture-handler';

interface ServerChatItemProps
  extends Omit<ChatItemProps, 'displayedContents'> {}

const ServerChatItem = (props: ServerChatItemProps) => {
  const { emojis, members, roles, categories } = useServer();
  const channels = useMemo(() => {
    return categories.map((category) => category.channels).flat();
  }, [categories]);

  const parseContent = useCallback(() => {
    const userPattern = /<@!?(?:[a-f0-9]{24})>/g;
    const rolePattern = /<@&(?:[a-f0-9]{24})>/g;
    const channelPattern = /<#(?:[a-f0-9]{24})>/g;
    const emojiPattern = /<:(?:.*?):(?:[a-f0-9]{24})>/g;

    const regex = new RegExp(
      `(${userPattern.source}|${rolePattern.source}|${channelPattern.source}|${emojiPattern.source})`,
      'g'
    );

    const parts = props.message.content.split(regex);

    return parts.map((part) => {
      let match;
      if ((match = /<@!?([a-f0-9]{24})>/g.exec(part))) {
        const userId = match[1];
        const member = members.find((member) => member.user_id === userId);
        return (
          <Text style={styles.highlightText}>@{member?.display_name}</Text>
        );
      }
      if ((match = /<@&([a-f0-9]{24})>/g.exec(part))) {
        const roleId = match[1];
        const role = roles.find((role) => role.id === roleId);
        if (role?.default) {
          return <Text style={styles.highlightText}>@everyone</Text>;
        }
        return <Text style={styles.highlightText}>@{role?.name}</Text>;
      }
      if ((match = /<#([a-f0-9]{24})>/g.exec(part))) {
        const channelId = match[1];
        const channel = channels.find((channel) => channel.id === channelId);
        return <Text style={styles.highlightText}>#{channel?.name}</Text>;
      }
      if ((match = /<:(?:.*?):([a-f0-9]{24})>/g.exec(part))) {
        const emojiId = match[1];
        const emoji = emojis.find((emoji) => emoji.id === emojiId);
        return (
          <Image
            source={{ uri: emoji?.image_url }}
            style={{ width: 20, height: 20 }}
          />
        );
      }
      return <Text>{part}</Text>;
    });
  }, [props.message.content, emojis, members, roles, channels]);

  return <BaseChatItem {...props} displayedContents={parseContent()} />;
};

export default ServerChatItem;

const styles = StyleSheet.create({
  highlightText: {
    color: colors.primary,
    backgroundColor: colors.tertiary,
    fontFamily: fonts.bold
  }
});
