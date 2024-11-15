import { Image, StyleSheet, Text, View } from 'react-native';
import React, { ReactNode, useEffect, useMemo } from 'react';
import { Message, Reaction } from '@/types/chat';
import MyText from '../MyText';
import { colors, fonts } from '@/constants/theme';
import { TextStyles } from '@/styles/TextStyles';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { DefaultProfileImage } from '@/constants/images';
import { ServerProfile, UserProfile } from '@/types';
import IconWithSize from '../IconWithSize';
import ReplyIcon from '@/assets/icons/ReplyIcon';
import Avatar from '../Avatar';
import { StatusType } from '@/types/user_status';
import { Emoji } from '@/types/server';
import { useAuth } from '@/context/AuthProvider';
import { deleteData, postData } from '@/utils/api';
import useServers from '@/hooks/useServers';
import { useConversations } from '@/context/ConversationsProvider';

const ReactionItem = (props: {
  reaction: Reaction;
  emoji: Emoji;
  message: Message;
  channel_id: string;
  conversation_id: string;
}) => {
  const { user } = useAuth();
  const { currentServerId } = useServers();
  const { dispatch } = useConversations();
  const isReacted = useMemo(() => {
    return props.reaction.reactors.includes(user?.id || '');
  }, [props.reaction.reactors, user]);

  const handleReactionPress = () => {
    if (isReacted) {
      deleteData(
        `/api/v1/servers/${currentServerId}/channels/${props.channel_id}/messages/${props.message.id}/reactions`,
        {
          emoji_id: props.emoji.id
        }
      );
    } else {
      postData(
        `/api/v1/servers/${currentServerId}/channels/${props.channel_id}/messages/${props.message.id}/reactions`,
        {
          emoji_id: props.emoji.id
        }
      );
    }
  };

  if (!props.emoji) return null;

  return (
    <TouchableOpacity
      style={[
        styles.reactionContainer,
        isReacted && styles.highlightedReactionContainer
      ]}
      onPress={handleReactionPress}
    >
      <Image
        source={{ uri: props.emoji.image_url }}
        style={styles.reactionEmoji}
      />
      <MyText style={TextStyles.bodyM}>{props.reaction.count}</MyText>
    </TouchableOpacity>
  );
};

export interface ChatItemProps {
  message: Message;
  channel_id: string;
  onLongPress?: () => void;
  parseContent: (content?: string) => ReactNode[];
  users: ServerProfile[];
  emojis: Emoji[];
  conversation_id: string;
}

const BaseChatItem = (props: ChatItemProps) => {
  const convertTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
  };

  const currentUser = useMemo(() => {
    return props.users.find((user) => user.user_id === props.message.sender_id);
  }, [props.users, props.message.sender_id]);

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
        <Avatar
          id={''}
          profile={currentUser}
          onlineStatus={
            currentUser?.status.is_online
              ? currentUser.status.type
              : StatusType.OFFLINE
          }
          showStatus
        />
        <View style={styles.innerContainer}>
          <View style={styles.messageHeader}>
            <MyText style={styles.displayName}>
              {currentUser?.display_name || '<Unknown User>'}
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
          <View style={styles.reactionsContainer}>
            {props.message.reactions?.map((reaction, index) => (
              <ReactionItem
                key={index}
                reaction={reaction}
                emoji={
                  props.emojis.find((emoji) => emoji.id === reaction.emoji_id)!
                }
                message={props.message}
                channel_id={props.channel_id}
                conversation_id={props.conversation_id}
              />
            ))}
          </View>
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
  reactionsContainer: {
    flexWrap: 'wrap',
    flexDirection: 'row',
    gap: 8
  },
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
  },
  reactionContainer: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 8,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.gray04,
    borderWidth: 1,
    borderColor: colors.gray02
  },
  highlightedReactionContainer: {
    backgroundColor: colors.secondary,
    borderColor: colors.primary
  },
  reactionEmoji: {
    width: 24,
    height: 24
  }
});
