import React, { useCallback, useMemo } from 'react';
import useServer from './useServer';
import useServers from './useServers';
import { Image, StyleSheet, Text } from 'react-native';
import { colors, fonts } from '@/constants/theme';
import MyText from '@/components/MyText';

const useDMParseContent = () => {
  const { emojiCategories } = useServers();
  const emojis = useMemo(
    () => emojiCategories.flatMap((category) => category.emojis),
    [emojiCategories]
  );

  const parseContent = useCallback(
    (content?: string) => {
      if (!content) return [];

      const emojiPattern = /<:(?:.*?):(?:[a-f0-9]{24})>/g;

      const regex = new RegExp(`(${emojiPattern.source})`, 'g');

      const parts = content.split(regex);

      return parts
        .map((part) => {
          let match;
          if ((match = /<:(?:.*?):([a-f0-9]{24})>/g.exec(part))) {
            const emojiId = match[1];
            const emoji = emojis.find((emoji) => emoji.id === emojiId);
            if (!emoji) return <Text>{part}</Text>;
            if (!emoji.image_url) return <MyText>{emoji.unicode}</MyText>;
            return (
              <Image
                source={{ uri: emoji.image_url }}
                style={{ width: 20, height: 20 }}
              />
            );
          }
          return <MyText>{part}</MyText>;
        })
        .map((part, index) => (
          <React.Fragment key={index}>{part}</React.Fragment>
        ));
    },
    [emojis]
  );

  return parseContent;
};

export default useDMParseContent;

const styles = StyleSheet.create({
  highlightText: {
    color: colors.primary,
    backgroundColor: colors.tertiary,
    fontFamily: fonts.bold
  }
});
