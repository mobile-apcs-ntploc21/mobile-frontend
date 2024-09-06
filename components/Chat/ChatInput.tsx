import { StyleSheet, Text, Touchable, View } from 'react-native';
import React, { useRef } from 'react';
import { TextInput } from 'react-native-gesture-handler';
import { colors } from '@/constants/theme';
import { TouchableOpacity } from '@gorhom/bottom-sheet';
import IconWithSize from '../IconWithSize';
import PlusIcon from '@/assets/icons/PlusIcon';
import ImageIcon from '@/assets/icons/ImageIcon';
import MicIcon from '@/assets/icons/MicIcon';
import EmojiIcon from '@/assets/icons/EmojiIcon';

const IconButton = ({
  icon,
  size
}: React.ComponentProps<typeof IconWithSize>) => {
  return (
    <TouchableOpacity>
      <IconWithSize icon={icon} size={size} color={colors.primary} />
    </TouchableOpacity>
  );
};

const ChatInput = () => {
  return (
    <View style={styles.container}>
      <View style={styles.chatBarContainer}>
        <IconButton icon={PlusIcon} size={32} />
        <IconButton icon={ImageIcon} size={32} />
        <View style={styles.inputContainer}>
          <TextInput style={styles.input} placeholder="Message..." />
          <IconButton icon={EmojiIcon} size={24} />
        </View>
        <IconButton icon={MicIcon} size={32} />
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
    height: 36,
    paddingLeft: 8,
    paddingRight: 6,
    backgroundColor: colors.gray03,
    borderRadius: 18,
    flexDirection: 'row',
    alignItems: 'center'
  },
  input: {
    flex: 1,
    fontSize: 12,
    color: colors.black
  }
});
