import { Image, StyleSheet, Text, View } from 'react-native';
import React, { ReactNode, useEffect } from 'react';
import { Message } from '@/types/chat';
import MyText from '../MyText';
import { colors, fonts } from '@/constants/theme';
import { TextStyles } from '@/styles/TextStyles';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { DefaultProfileImage } from '@/constants/images';
import { UserProfile } from '@/types';
import IconWithSize from '../IconWithSize';
import ReplyIcon from '@/assets/icons/ReplyIcon';

export interface ChatItemProps {
  message: Message;
  onLongPress?: () => void;
  parseContent: (content?: string) => ReactNode[];
  users: UserProfile[];
}

const BaseChatItem = (props: ChatItemProps) => {
  const convertTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
  };

  const renderReplyDisplayName = () => {
    if (!props.message.replied_message) return null;
    const repliedUser = props.users.find(
      (user) => user.user_id === props.message.replied_message!.sender_id
    );
    if (!repliedUser) {
      return (
        <MyText
          style={[
            styles.replyDisplayName,
            {
              fontFamily: fonts.regular
            }
          ]}
        >
          {'<Unknown User>'}
        </MyText>
      );
    }
    return (
      <MyText style={styles.replyDisplayName}>
        {repliedUser.display_name}
      </MyText>
    );
  };

  return (
    <TouchableOpacity style={styles.container} onLongPress={props.onLongPress}>
      {props.message.replied_message && (
        <View style={styles.replyContainer}>
          <IconWithSize icon={ReplyIcon} size={24} color={colors.gray01} />
          {renderReplyDisplayName()}
          <MyText
            style={styles.replyMessage}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {props.parseContent(props.message.replied_message.content)}
          </MyText>
        </View>
      )}

      <View style={styles.messageContainer}>
        <Image
          source={
            props.message.author.avatar_url
              ? { uri: props.message.author.avatar_url }
              : DefaultProfileImage
          }
          style={styles.avatarImg}
        />
        <View style={styles.innerContainer}>
          <View style={styles.messageHeader}>
            <MyText style={styles.displayName}>
              {props.message.author.display_name}
            </MyText>
            <MyText style={styles.timestamp}>
              {convertTimestamp(props.message.createdAt)}
            </MyText>
          </View>
          <View style={styles.messageContent}>
            <MyText style={styles.message}>
              {props.parseContent(props.message.content)}
              {props.message.is_modified && (
                <Text style={styles.editedText}> (edited)</Text>
              )}
            </MyText>
          </View>
          <View style={styles.reactionsContainer}></View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default BaseChatItem;

const styles = StyleSheet.create({
  container: {},
  messageContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 8
  },
  avatarImg: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.gray03
  },
  innerContainer: {
    flex: 1,
    gap: 4
  },
  messageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  displayName: {
    ...TextStyles.h3
  },
  timestamp: {
    ...TextStyles.bodyM,
    color: colors.gray02
  },
  messageContent: {},
  message: {
    ...TextStyles.bodyL
  },
  editedText: {
    ...TextStyles.bodyS,
    color: colors.gray02
  },
  reactionsContainer: {},
  replyContainer: {
    paddingLeft: 24,
    paddingRight: 8,
    gap: 8,
    flexDirection: 'row',
    alignItems: 'center',
    opacity: 0.6
  },
  replyDisplayName: {
    fontSize: 14,
    fontFamily: fonts.bold
  },
  replyMessage: {
    fontSize: 14,
    fontFamily: fonts.regular,
    flex: 1
  }
});
