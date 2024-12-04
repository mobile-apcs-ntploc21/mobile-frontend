import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { Dispatch, SetStateAction, useMemo } from 'react';
import { AttachmentPicked } from './BaseChatInput';
import { FlatList } from 'react-native-gesture-handler';
import { colors } from '@/constants/theme';
import { getAttachmentType } from '@/utils/file';
import { AttachmentTypes } from '@/types/attachment';
import IconWithSize from '../IconWithSize';
import CrossIcon from '@/assets/icons/CrossIcon';
import MyText from '../MyText';
import DocumentIcon from '@/assets/icons/DocumentIcon';
import { Image } from 'expo-image';
import PlayArrowIcon from '@/assets/icons/PlayArrowIcon';

const AttachmentItem = (props: {
  attachment: AttachmentPicked;
  onRemove: () => void;
}) => {
  const fileExtenstion = useMemo(() => {
    const parts = props.attachment.filename.split('.');
    return parts[parts.length - 1];
  }, [props.attachment.filename]);

  if (getAttachmentType(props.attachment.fileType) === AttachmentTypes.Image) {
    return (
      <View>
        <Image
          source={{ uri: props.attachment.uri }}
          style={styles.imageContainer}
        />
        <TouchableOpacity style={styles.removeButton} onPress={props.onRemove}>
          <IconWithSize icon={CrossIcon} size={16} color={colors.gray02} />
        </TouchableOpacity>
      </View>
    );
  }

  if (getAttachmentType(props.attachment.fileType) === AttachmentTypes.Video) {
    return (
      <View>
        <Image
          source={{ uri: props.attachment.uri }}
          style={styles.imageContainer}
        />
        <TouchableOpacity style={styles.removeButton} onPress={props.onRemove}>
          <IconWithSize icon={CrossIcon} size={16} color={colors.gray02} />
        </TouchableOpacity>
        <View style={styles.videoOverlay}>
          <IconWithSize icon={PlayArrowIcon} size={24} color={colors.gray04} />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.attachmentContainer}>
      <TouchableOpacity style={styles.removeButton} onPress={props.onRemove}>
        <IconWithSize icon={CrossIcon} size={16} color={colors.gray02} />
      </TouchableOpacity>
      <IconWithSize icon={DocumentIcon} size={32} color={colors.gray02} />
      <View style={styles.attachmentInfo}>
        <MyText
          style={styles.attachmentName}
          numberOfLines={1}
          ellipsizeMode="middle"
        >
          {props.attachment.filename}
        </MyText>
        <MyText style={styles.attachmentExt}>{fileExtenstion}</MyText>
      </View>
    </View>
  );
};

export type AttachmentBarProps = {
  attachments: AttachmentPicked[];
  setAttachments: Dispatch<SetStateAction<AttachmentPicked[]>>;
};

const AttachmentBar = (props: AttachmentBarProps) => {
  if (props.attachments.length === 0) {
    return null;
  }
  return (
    <FlatList
      horizontal
      data={props.attachments}
      keyExtractor={(item) => item.key}
      renderItem={({ item }) => (
        <AttachmentItem
          attachment={item}
          onRemove={() => {
            props.setAttachments((attachments) =>
              attachments.filter((attachment) => attachment.key !== item.key)
            );
          }}
        />
      )}
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    />
  );
};

export default AttachmentBar;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    borderTopWidth: 1,
    borderTopColor: colors.gray03,
    backgroundColor: colors.gray04
  },
  contentContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 16
  },
  attachmentContainer: {
    width: 136,
    height: 56,
    backgroundColor: colors.gray03,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    gap: 4
  },
  removeButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    right: -8,
    top: -4
  },
  imageContainer: {
    width: 56,
    height: 56,
    borderRadius: 8
  },
  videoOverlay: {
    position: 'absolute',
    top: 16,
    left: 16,
    width: 24,
    height: 24,
    borderRadius: 4,
    backgroundColor: colors.gray01_50,
    justifyContent: 'center',
    alignItems: 'center'
  },
  attachmentInfo: {
    flex: 1,
    justifyContent: 'center'
  },
  attachmentName: {
    fontSize: 10
  },
  attachmentExt: {
    fontSize: 10,
    color: colors.gray02,
    textTransform: 'uppercase'
  }
});
