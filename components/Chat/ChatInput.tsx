import { StyleSheet, Text, TextInput, Touchable, View } from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import { colors } from '@/constants/theme';
import { TouchableOpacity } from '@gorhom/bottom-sheet';
import IconWithSize from '../IconWithSize';
import PlusIcon from '@/assets/icons/PlusIcon';
import ImageIcon from '@/assets/icons/ImageIcon';
import MicIcon from '@/assets/icons/MicIcon';
import EmojiIcon from '@/assets/icons/EmojiIcon';
import Animated from 'react-native-reanimated';
import ArrowForwardIcon from '@/assets/icons/ArrowForwardIcon';
import SendIcon from '@/assets/icons/SendIcon';

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
}

const ChatInput = (props: ChatInputProps) => {
  const inputRef = useRef<TextInput>(null);
  const [isHidden, setIsHidden] = useState(false);

  const onChange = (text: string) => {
    props.onChange?.(text);
    setIsHidden(text.length > 0);
  };

  return (
    <View style={styles.container}>
      <View style={styles.chatBarContainer}>
        {!isHidden ? (
          <>
            <IconButton icon={PlusIcon} size={32} />
            <IconButton icon={ImageIcon} size={32} />
          </>
        ) : (
          <IconButton
            icon={ArrowForwardIcon}
            size={32}
            onPress={() => setIsHidden(false)}
          />
        )}
        <View style={styles.inputContainer}>
          <TextInput
            ref={inputRef}
            style={styles.input}
            placeholder="Message..."
            value={props.value}
            onChangeText={onChange}
            multiline
            onFocus={() => setIsHidden(true)}
            onBlur={() => setIsHidden(false)}
          />
          <IconButton icon={EmojiIcon} size={24} />
        </View>
        {props.value?.length === 0 ? (
          <IconButton icon={MicIcon} size={32} />
        ) : (
          <IconButton icon={SendIcon} size={32} />
        )}
      </View>
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
    alignItems: 'center'
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: colors.black,
    paddingVertical: 0
  }
});
