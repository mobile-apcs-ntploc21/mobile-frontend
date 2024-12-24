import {
  Image,
  Linking,
  StyleSheet,
  Text,
  TouchableHighlight,
  TouchableOpacity,
  View
} from 'react-native';
import React, {
  createRef,
  ReactNode,
  useEffect,
  useMemo,
  useState
} from 'react';
import { Message, Reaction } from '@/types/chat';
import MyText from '../MyText';
import { colors, fonts } from '@/constants/theme';
import { TextStyles } from '@/styles/TextStyles';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
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
import DocumentIcon from '@/assets/icons/DocumentIcon';
import DownloadIcon from '@/assets/icons/DownloadIcon';
import { AttachmentTypes } from '@/types/attachment';
import { ResizeMode, Video, VideoFullscreenUpdate } from 'expo-av';
import { router } from 'expo-router';

const AttachmentItem = (props: { attachment: Message['attachments'][0] }) => {
  if (props.attachment.type == AttachmentTypes.Image) {
    return (
      <View style={styles.attachmentWrapper}>
        <TouchableOpacity
          onPress={() =>
            router.navigate({
              pathname: '/modal/image-viewer',
              params: {
                image_uri: props.attachment.url,
                filename: props.attachment.filename
              }
            })
          }
        >
          <Image
            source={{ uri: props.attachment.url }}
            style={{ width: '100%', aspectRatio: 1, borderRadius: 8 }}
          />
        </TouchableOpacity>
      </View>
    );
  }

  if (props.attachment.type == AttachmentTypes.Video) {
    const ref = createRef<Video>();
    const [isFullscreen, setIsFullscreen] = useState(false);

    return (
      <View style={styles.attachmentWrapper}>
        <Video
          ref={ref}
          source={{ uri: props.attachment.url }}
          style={{ width: '100%', aspectRatio: 1, borderRadius: 8 }}
          useNativeControls
          resizeMode={isFullscreen ? ResizeMode.CONTAIN : ResizeMode.COVER}
          onTouchEnd={() => ref.current?._setFullscreen(true)}
          onFullscreenUpdate={({ fullscreenUpdate }) => {
            if (fullscreenUpdate === VideoFullscreenUpdate.PLAYER_DID_PRESENT) {
              setIsFullscreen(true);
            } else if (
              fullscreenUpdate === VideoFullscreenUpdate.PLAYER_WILL_DISMISS
            ) {
              setIsFullscreen(false);
            }
          }}
        />
      </View>
    );
  }

  return (
    <View style={styles.attachmentWrapper}>
      <TouchableWithoutFeedback
        style={styles.attachmentContainer}
        onPress={() => Linking.openURL(props.attachment.url)}
      >
        <IconWithSize icon={DocumentIcon} size={32} color={colors.gray02} />
        <View style={styles.attachmentInfo}>
          <MyText
            style={styles.attachmentName}
            numberOfLines={1}
            ellipsizeMode="middle"
          >
            {props.attachment.filename}
          </MyText>
          <MyText style={styles.attachmentSize}>{props.attachment.size}</MyText>
        </View>
        <IconWithSize icon={DownloadIcon} size={32} color={colors.gray02} />
      </TouchableWithoutFeedback>
    </View>
  );
};

const ReactionItem = (props: {
  reaction: Reaction;
  emoji: Emoji;
  message: Message;
  conversation_id: string;
  onReact: () => void;
  onUnreact: () => void;
}) => {
  const { user } = useAuth();
  const isReacted = useMemo(() => {
    return props.reaction.reactors.includes(user?.id || '');
  }, [props.reaction.reactors, user]);

  const handleReactionPress = () => {
    if (isReacted) {
      props.onUnreact();
    } else {
      props.onReact();
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
  onLongPress?: () => void;
  parseContent: (content?: string) => ReactNode[];
  users: UserProfile[];
  emojis: Emoji[];
  conversation_id: string;
  onReact: (emoji_id: string) => void;
  onUnreact: (emoji_id: string) => void;
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
    <TouchableHighlight
      style={styles.container}
      onLongPress={props.onLongPress}
      underlayColor={colors.gray04}
    >
      <View>
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
            profilePic={currentUser?.avatar_url}
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
            {props.message.attachments?.map((attachment, index) => (
              <AttachmentItem key={index} attachment={attachment} />
            ))}
            <View style={styles.reactionsContainer}>
              {props.message.reactions?.map((reaction, index) => (
                <ReactionItem
                  key={index}
                  reaction={reaction}
                  emoji={
                    props.emojis.find(
                      (emoji) => emoji.id === reaction.emoji_id
                    )!
                  }
                  message={props.message}
                  conversation_id={props.conversation_id}
                  onReact={() => props.onReact(reaction.emoji_id)}
                  onUnreact={() => props.onUnreact(reaction.emoji_id)}
                />
              ))}
            </View>
          </View>
        </View>
      </View>
    </TouchableHighlight>
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
  },
  attachmentWrapper: {
    padding: 4
  },
  attachmentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    height: 56,
    paddingHorizontal: 8,
    gap: 8,
    borderRadius: 8,
    backgroundColor: colors.gray03
  },
  attachmentInfo: {
    flex: 1,
    justifyContent: 'center'
  },
  attachmentName: {
    ...TextStyles.bodyL,
    color: colors.primary
  },
  attachmentSize: {
    ...TextStyles.bodyS
  }
});
