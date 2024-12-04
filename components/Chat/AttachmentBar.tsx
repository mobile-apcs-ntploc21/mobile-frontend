import { StyleSheet, Text, View } from 'react-native';
import React, { useMemo } from 'react';
import { AttachmentPicked } from './BaseChatInput';
import { FlatList } from 'react-native-gesture-handler';
import { colors } from '@/constants/theme';
import { getAttachmentType } from '@/utils/file';
import { AttachmentTypes } from '@/types/attachment';
import { TouchableOpacity } from '@gorhom/bottom-sheet';
import IconWithSize from '../IconWithSize';
import CrossIcon from '@/assets/icons/CrossIcon';
import MyText from '../MyText';
import DocumentIcon from '@/assets/icons/DocumentIcon';

const AttachmentItem = (props: { attachment: AttachmentPicked }) => {
  const fileExtenstion = useMemo(() => {
    const parts = props.attachment.filename.split('.');
    return parts[parts.length - 1];
  }, [props.attachment.filename]);

  return (
    <View style={styles.attachmentContainer}>
      <TouchableOpacity style={styles.removeButton}>
        <IconWithSize icon={CrossIcon} size={16} color={colors.gray02} />
      </TouchableOpacity>
      <View style={styles.attachmentContent}>
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
    </View>
  );
};

export type AttachmentBarProps = {
  attachments: AttachmentPicked[];
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
      renderItem={({ item }) => <AttachmentItem attachment={item} />}
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
    borderRadius: 8
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
  attachmentContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    gap: 4
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
