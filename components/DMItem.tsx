import { StyleSheet, View } from 'react-native';
import React, { useMemo } from 'react';
import { colors, fonts } from '@/constants/theme';
import { TextStyles } from '@/styles/TextStyles';
import { TouchableOpacity } from 'react-native-gesture-handler';
import useServerParseContent from '@/hooks/useServerParseContent';
import MyText from '@/components/MyText';
import Avatar from '@/components/Avatar';
import useDMParseContent from '@/hooks/useDMParseContent';
import { useDMContext } from '@/context/DMProvider';
import { useConversations } from '@/context/ConversationsProvider';
import { router } from 'expo-router';

interface DMItemProps {
  user_id: string;
}

const DMItem = (props: DMItemProps) => {
  const parseContent = useDMParseContent();

  const { data: dmChannels } = useDMContext();
  const { conversations } = useConversations();
  const dmChannel = useMemo(
    () => dmChannels?.find((dmChannel) => dmChannel.user_id === props.user_id)!,
    [dmChannels, props.user_id]
  );
  const conversation = useMemo(() => {
    return conversations.find(
      (conv) => conv.id === dmChannel?.conversation_id
    )!;
  }, [conversations, dmChannel?.conversation_id]);

  const getTimeDifference = (timestamp: string) => {
    if (!timestamp) return '';
    const diff = new Date().getTime() - new Date(timestamp).getTime();
    const days = Math.floor(diff / 1000 / 60 / 60 / 24);
    const hours = Math.floor(diff / 1000 / 60 / 60);
    const minutes = Math.floor((diff / 1000 / 60) % 60);
    if (days > 7) return timestamp.split('T')[0];
    if (days > 0) return `${days}d`;
    if (hours > 0) return `${hours}h`;
    if (minutes > 0) return `${minutes}m`;
    return 'Now';
  };

  const convertUnreadCount = (count: number) => {
    if (count > 9) return '9+';
    return count.toString();
  };

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => router.navigate(`/conversation/dm/${props.user_id}`)}
    >
      <View style={styles.channelContainer}>
        <Avatar
          id={props.user_id}
          profilePic={dmChannel?.avatar_url}
          showStatus
          avatarStyle={styles.avatarImg}
        />
        <View style={styles.channelMessageContainer}>
          <MyText style={TextStyles.h4}>{dmChannel?.name}</MyText>
          <MyText
            style={TextStyles.bodyM}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {parseContent(conversation?.messages[0]?.content)}
            {/* Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec */}
          </MyText>
        </View>
      </View>
      <View style={styles.infoContainer}>
        <MyText style={TextStyles.bodyM}>
          {getTimeDifference(conversation?.messages[0]?.createdAt)}
        </MyText>
        {conversation.number_of_unread_mentions > 0 ? (
          <View style={styles.unreadContainer}>
            <MyText style={{ color: colors.white }}>
              {convertUnreadCount(conversation.number_of_unread_mentions)}
            </MyText>
          </View>
        ) : conversation.has_new_message ? (
          <View style={styles.newMessage} />
        ) : null}
      </View>
    </TouchableOpacity>
  );
};

export default DMItem;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 4
  },
  channelContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 20,
    flex: 1
  },
  infoContainer: {
    gap: 4,
    alignItems: 'flex-end'
  },
  avatarImg: {
    width: 60,
    height: 60,
    borderRadius: 30
  },
  channelMessageContainer: {
    gap: 8,
    flex: 1
  },
  channelName: {
    fontSize: 12,
    fontFamily: fonts.bold
  },
  unreadContainer: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center'
  },
  newMessage: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 4,
    borderColor: colors.gray01
  }
});
