import { Image, StyleSheet, Text, View } from 'react-native';
import React, { useEffect, useMemo } from 'react';
import BaseChatInput, { BaseChatInputProps } from './BaseChatInput';
import useServer from '@/hooks/useServer';
import { ServerProfile } from '@/types';
import { Channel, Emoji, Role } from '@/types/server';
import { FlatList, TouchableOpacity } from 'react-native-gesture-handler';
import { DefaultProfileImage } from '@/constants/images';
import { TextStyles } from '@/styles/TextStyles';
import MyText from '../MyText';
import { colors, fonts } from '@/constants/theme';
import { handleError } from '@apollo/client/link/http/parseAndCheckHttpResponse';
import IconWithSize from '../IconWithSize';
import CrossIcon from '@/assets/icons/CrossIcon';
import useServers from '@/hooks/useServers';

const EmojiSuggestion = ({ emoji }: { emoji: Emoji }) => {
  return (
    <View style={styles.suggestionContainer}>
      <Image source={{ uri: emoji.image_url }} style={styles.emojiImg} />
      <MyText style={styles.suggestionText}>:{emoji.name}:</MyText>
    </View>
  );
};

interface DMChatInputProps
  extends Omit<BaseChatInputProps, 'mentions' | 'emojis' | 'channels'> {
  mode:
    | {
        type: 'edit';
      }
    | {
        type: 'reply';
        replyTo: string;
      }
    | null;
  onCancelMode?: () => void;
}

const DMChatInput = (props: DMChatInputProps) => {
  const { emojiCategories } = useServers();
  const emojis = useMemo(
    () => emojiCategories.flatMap((category) => category.emojis),
    [emojiCategories]
  );

  const [lastWord, setLastWord] = React.useState<string | null>(null);

  useEffect(() => {
    if (!props.value) {
      setLastWord(null);
      return;
    }
    const lastWord = props.value.split(' ').pop();
    if (lastWord === undefined) {
      setLastWord(null);
      return;
    }
    if (
      lastWord.startsWith('@') ||
      lastWord.startsWith('#') ||
      lastWord.startsWith(':')
    ) {
      setLastWord(lastWord);
    } else {
      setLastWord(null);
    }
  }, []);

  const suggestions = useMemo(() => {
    if (!lastWord) return [];
    const suggestionList: {
      name: string;
      subname?: string;
      component: React.ReactNode;
    }[] = [
      ...emojis.map((emoji) => ({
        name: `:${emoji.name}:`,
        component: <EmojiSuggestion emoji={emoji} />
      }))
    ];
    return suggestionList.filter(
      (suggestion) =>
        suggestion.name
          .toLocaleLowerCase()
          .startsWith(lastWord.toLocaleLowerCase()) ||
        suggestion.subname
          ?.toLocaleLowerCase()
          .startsWith(lastWord.toLocaleLowerCase())
    );
  }, [lastWord, emojis]);

  const handleSuggestionPress = (suggestion: string) => {
    if (!lastWord) return;
    if (!props.value) return;
    const newText = props.value
      .split(' ')
      .slice(0, -1)
      .join(' ')
      .concat(` ${suggestion} `);
    props.onChange?.(newText);
  };

  return (
    <View>
      <FlatList
        keyboardShouldPersistTaps="always"
        data={suggestions}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => handleSuggestionPress(item.name)}>
            {item.component}
          </TouchableOpacity>
        )}
        keyExtractor={(item, index) => index.toString()}
        style={styles.suggestionsList}
      />
      {props.mode && (
        <TouchableOpacity onPress={props.onCancelMode}>
          <View style={styles.modeContainer}>
            {props.mode.type === 'edit' ? (
              <MyText style={styles.modeText}>Editing</MyText>
            ) : (
              <Text>
                <MyText style={styles.modeText}>Replying to </MyText>
                <MyText style={{ fontFamily: fonts.bold }}>
                  {props.mode.replyTo}
                </MyText>
              </Text>
            )}
            <IconWithSize icon={CrossIcon} size={16} />
          </View>
        </TouchableOpacity>
      )}
      <BaseChatInput {...props} emojis={emojis.map((emoji) => emoji.name)} />
    </View>
  );
};

export default DMChatInput;

const styles = StyleSheet.create({
  suggestionsList: {
    maxHeight: 176
  },
  suggestionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    gap: 8,
    backgroundColor: colors.gray04
  },
  avatarImg: {
    width: 32,
    height: 32,
    borderRadius: 16
  },
  emojiImg: {
    width: 24,
    height: 24
  },
  suggestionTextContainer: {
    flexDirection: 'column',
    gap: 4
  },
  suggestionText: {
    fontSize: 12,
    fontFamily: fonts.bold
  },
  suggestionSubText: {
    fontSize: 10,
    color: colors.gray02
  },
  modeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 4,
    backgroundColor: colors.gray04
  },
  modeText: {
    fontSize: 12
  }
});
