import {
  Keyboard,
  StyleSheet,
  Text,
  TextInput,
  Touchable,
  View
} from 'react-native';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { colors, fonts } from '@/constants/theme';
import { TouchableOpacity } from '@gorhom/bottom-sheet';
import IconWithSize from '../IconWithSize';
import PlusIcon from '@/assets/icons/PlusIcon';
import ImageIcon from '@/assets/icons/ImageIcon';
import MicIcon from '@/assets/icons/MicIcon';
import EmojiIcon from '@/assets/icons/EmojiIcon';
import Animated from 'react-native-reanimated';
import ArrowForwardIcon from '@/assets/icons/ArrowForwardIcon';
import SendIcon from '@/assets/icons/SendIcon';
import EmojiPicker from './EmojiPicker';

const IconButton = ({
  icon,
  size,
  onPress
}: React.ComponentProps<typeof IconWithSize> & {
  onPress?: () => void;
}) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <IconWithSize icon={icon} size={size} color={colors.primary} />
    </TouchableOpacity>
  );
};

interface ChatInputProps {
  value?: string;
  onChange?: (text: string) => void;
  mentions?: string[];
  emojis?: string[];
  channels?: string[];
}

const ChatInput = (props: ChatInputProps) => {
  const inputRef = useRef<TextInput>(null);
  const [isIconHidden, setIsIconHidden] = useState(false);
  const [emojiPickerVisible, setEmojiPickerVisible] = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      (e) => {
        setKeyboardHeight(e.endCoordinates.height);
      }
    );

    return () => {
      keyboardDidShowListener.remove();
    };
  }, []);

  const onChange = (text: string) => {
    props.onChange?.(text);
    setIsIconHidden(text.length > 0);
  };

  const handleOpenEmoji = () => {
    setEmojiPickerVisible(true);
    Keyboard.dismiss();
  };

  const parseText = useCallback(
    (text?: string) => {
      if (!text || !props.emojis || !props.mentions || !props.channels)
        return <Text>{text}</Text>;
      const mentionPatterns = props.mentions
        .map((mention) => `@${mention}`)
        .sort((a, b) => b.length - a.length);
      const channelPatterns = props.channels
        .map((channel) => `#${channel}`)
        .sort((a, b) => b.length - a.length);
      const emojiPatterns = props.emojis.map((emoji) => `:${emoji}:`);

      // mentions and channels should be surrounded by whitespace or at the beginning/end of the text
      const mentionRegex = new RegExp(
        `(?<=^|\\s)(${mentionPatterns
          .map((mention) => mention.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
          .join('|')})(?=\\s|$)`,
        'g'
      );
      const channelRegex = new RegExp(
        `(?<=^|\\s)(${channelPatterns
          .map((channel) => channel.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
          .join('|')})(?=\\s|$)`,
        'g'
      );

      // emojis don't need to be surrounded by whitespace
      const emojiRegex = new RegExp(
        `(${emojiPatterns
          .map((emoji) => emoji.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
          .join('|')})`,
        'g'
      );

      const regex = new RegExp(
        `(?:${mentionRegex.source}|${emojiRegex.source}|${channelRegex.source})`,
        'g'
      );
      const parts = text.split(regex);

      return parts.map((part, index) => {
        if (
          mentionPatterns.includes(part) ||
          emojiPatterns.includes(part) ||
          channelPatterns.includes(part)
        ) {
          return (
            <Text
              key={index}
              style={{ color: colors.primary, fontFamily: fonts.bold }}
            >
              {part}
            </Text>
          );
        }

        return <Text key={index}>{part}</Text>;
      });
    },
    [props.emojis, props.mentions]
  );

  return (
    <View style={styles.container}>
      <View style={styles.chatBarContainer}>
        {!isIconHidden ? (
          <>
            <IconButton icon={PlusIcon} size={32} />
            <IconButton icon={ImageIcon} size={32} />
          </>
        ) : (
          <IconButton
            icon={ArrowForwardIcon}
            size={32}
            onPress={() => setIsIconHidden(false)}
          />
        )}
        <View style={styles.inputContainer}>
          <TextInput
            autoFocus // show keyboard on first render to get keyboard height
            ref={inputRef}
            style={styles.input}
            placeholder="Message..."
            placeholderTextColor={colors.gray02}
            onChangeText={onChange}
            multiline
            onFocus={() => {
              setEmojiPickerVisible(false);
            }}
          >
            {parseText(props.value)}
          </TextInput>
          <View style={{ marginBottom: 2 }}>
            <IconButton icon={EmojiIcon} size={24} onPress={handleOpenEmoji} />
          </View>
        </View>
        {props.value?.length === 0 ? (
          <IconButton icon={MicIcon} size={32} />
        ) : (
          <IconButton icon={SendIcon} size={32} />
        )}
      </View>
      <EmojiPicker
        visible={emojiPickerVisible}
        handleClose={() => setEmojiPickerVisible(false)}
        height={keyboardHeight}
      />
    </View>
  );
};

export default ChatInput;

const styles = StyleSheet.create({
  container: {
    width: '100%'
  },
  chatBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    gap: 8,
    width: '100%',
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderColor: colors.gray03
  },
  inputContainer: {
    flex: 1,
    paddingLeft: 8,
    paddingRight: 6,
    paddingVertical: 4,
    gap: 8,
    backgroundColor: colors.gray03,
    borderRadius: 18,
    flexDirection: 'row',
    alignItems: 'flex-end'
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: colors.black,
    paddingVertical: 0,
    fontFamily: fonts.regular
  }
});
