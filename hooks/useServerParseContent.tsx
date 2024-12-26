import React, { useCallback, useMemo } from 'react';
import useServer from './useServer';
import useServers from './useServers';
import { Image, StyleSheet, Text } from 'react-native';
import { colors, fonts } from '@/constants/theme';
import MyText from '@/components/MyText';
import config from '@/utils/config';

const useServerParseContent = () => {
  const { members, roles, categories } = useServer();
  const { currentServerId, emojiCategories } = useServers();
  const emojis = useMemo(
    () => emojiCategories.flatMap((category) => category.emojis),
    [emojiCategories]
  );
  const channels = useMemo(() => {
    return categories.map((category) => category.channels).flat();
  }, [categories]);

  const parseContent = useCallback(
    (content?: string) => {
      if (!content) return [];

      const userPattern = /<@!?(?:[a-f0-9]{24})>/g;
      const rolePattern = /<@&(?:[a-f0-9]{24})>/g;
      const channelPattern = /<#(?:[a-f0-9]{24})>/g;
      const emojiPattern = /<:(?:.*?):(?:[a-f0-9]{24})>/g;

      const regex = new RegExp(
        `(${userPattern.source}|${rolePattern.source}|${channelPattern.source}|${emojiPattern.source})`,
        'g'
      );

      const parts = content.split(regex);

      return parts
        .map((part) => {
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
            const channel = channels.find(
              (channel) => channel.id === channelId
            );
            return <Text style={styles.highlightText}>#{channel?.name}</Text>;
          }
          if ((match = /<:(?:.*?):([a-f0-9]{24})>/g.exec(part))) {
            const emojiId = match[1];
            const emoji = emojis.find((emoji) => emoji.id === emojiId);
            if (!emoji || !emoji.unicode)
              return (
                <Image
                  source={{ uri: `${config.CDN_URL}/emojis/${emojiId}.png` }}
                  style={{ width: 20, height: 20 }}
                />
              );
            return <MyText>{emoji.unicode}</MyText>;
          }
          return <MyText>{part}</MyText>;
        })
        .map((part, index) => (
          <React.Fragment key={index}>{part}</React.Fragment>
        ));
    },
    [emojis, members, roles, channels]
  );

  return parseContent;
};

export default useServerParseContent;

const styles = StyleSheet.create({
  highlightText: {
    color: colors.primary,
    backgroundColor: colors.tertiary,
    fontFamily: fonts.bold
  }
});
