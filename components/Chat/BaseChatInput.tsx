import {
  Keyboard,
  StyleSheet,
  Text,
  TextInput,
  Touchable,
  View
} from 'react-native';
import React, {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useRef,
  useState
} from 'react';
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
import { Emoji } from '@/types/server';
import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';
import { ImagePickerAsset } from 'expo-image-picker';
import { DocumentPickerAsset } from 'expo-document-picker';
import { getPresignedPostServer } from '@/utils/s3';
import { postData } from '@/utils/api';

export type AttachmentPicked = {
  key: string;
  uri: string;
  filename: string;
  fileType?: string;
  fileSize?: number;
};

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

export interface BaseChatInputProps {
  value?: string;
  onChange?: Dispatch<SetStateAction<string>>;
  onSend?: (attachmentsPicked: AttachmentPicked[] | null) => void;
  onUpload?: (
    filename: string,
    fileType?: string,
    fileSize?: number
  ) => Promise<{
    uploadUrl: string;
    fields: { [key: string]: string };
    key: string;
  }>;
  mentions?: string[];
  emojis?: string[];
  channels?: string[];
  emojiImports: Emoji[];
}

const BaseChatInput = (props: BaseChatInputProps) => {
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

  const onChange = useCallback(
    (text: string) => {
      props.onChange?.(text);
      setIsIconHidden(text.length > 0);
    },
    [props.onChange]
  );

  const [attachmentsPicked, setAttachmentsPicked] = useState<
    AttachmentPicked[]
  >([]);

  const uploadFile = async (
    uri: string,
    filename: string,
    fileType?: string,
    fileSize?: number
  ): Promise<AttachmentPicked> => {
    if (!props.onUpload) throw new Error('onUpload is not defined');
    try {
      const { uploadUrl, fields, key } = await props.onUpload?.(
        filename,
        fileType,
        fileSize
      );

      const formData = new FormData();
      Object.entries(fields).forEach(([key, value]) => {
        formData.append(key, value);
      });

      // @ts-ignore
      formData.append('file', {
        uri,
        type: fileType,
        name: filename
      });

      const response = await fetch(uploadUrl, {
        method: 'POST',
        body: formData
      });

      return {
        key,
        uri,
        filename,
        fileType,
        fileSize
      };
    } catch (e) {
      throw new Error('Failed to upload file');
    }
  };

  const pickAttachment = async () => {
    const result = await DocumentPicker.getDocumentAsync({
      multiple: true
    });
    if (result.canceled) return;

    const responseSettlement = await Promise.allSettled(
      result.assets.map(async (doc) => {
        const attachment = await uploadFile(
          doc.uri,
          doc.name,
          doc.mimeType,
          doc.size
        );
        return attachment;
      })
    );

    const attachments = responseSettlement
      .filter((result) => result.status === 'fulfilled')
      .map((result) => result.value as AttachmentPicked);

    setAttachmentsPicked((prev) => [...prev, ...attachments]);
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      allowsMultipleSelection: true,
      mediaTypes: ImagePicker.MediaTypeOptions.All
    });

    if (result.canceled) return;

    const responseSettlement = await Promise.allSettled(
      result.assets.map(async (image) => {
        const attachment = await uploadFile(
          image.uri,
          image.fileName || 'image.jpg',
          image.mimeType,
          image.fileSize
        );
        return attachment;
      })
    );

    const attachments = responseSettlement
      .filter((result) => result.status === 'fulfilled')
      .map((result) => result.value as AttachmentPicked);

    setAttachmentsPicked((prev) => [...prev, ...attachments]);
  };

  useEffect(() => {
    console.log(attachmentsPicked);
  }, [attachmentsPicked]);

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

      const mentionRegex = new RegExp(
        `(${mentionPatterns
          .map((mention) => mention.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
          .join('|')})`,
        'g'
      );

      const channelRegex = new RegExp(
        `(${channelPatterns
          .map((channel) => channel.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
          .join('|')})`,
        'g'
      );

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

  const handleEmojiSelect = useCallback((emoji: Emoji) => {
    props.onChange?.((text) => {
      return `${text}:${emoji.name}:`;
    });
  }, []);

  const handleCloseEmoji = useCallback(() => {
    setEmojiPickerVisible(false);
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.chatBarContainer}>
        {!isIconHidden ? (
          <>
            <IconButton icon={PlusIcon} size={32} onPress={pickAttachment} />
            <IconButton icon={ImageIcon} size={32} onPress={pickImage} />
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
          <IconButton
            icon={SendIcon}
            size={32}
            onPress={() => props.onSend?.(attachmentsPicked)}
          />
        )}
      </View>
      <EmojiPicker
        visible={emojiPickerVisible}
        handleClose={handleCloseEmoji}
        height={keyboardHeight}
        onSelect={handleEmojiSelect}
      />
    </View>
  );
};

export default BaseChatInput;

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
