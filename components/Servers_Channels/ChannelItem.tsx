import { Image, StyleSheet, Text, View } from 'react-native';
import React, { useMemo } from 'react';
import { colors, fonts } from '@/constants/theme';
import MyText from '../MyText';
import { TextStyles } from '@/styles/TextStyles';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { router } from 'expo-router';
import { DefaultChannelImage } from '@/constants/images';
import { Conversation } from '@/types/chat';
import { Channel } from '@/types/server';
import { useConversations } from '@/context/ConversationsProvider';
import useServerParseContent from '@/hooks/useServerParseContent';

interface ChannelItemProps {
  channel: Channel;
}

const ChannelItem = (props: ChannelItemProps) => {
  const { conversations } = useConversations();
  const conversation: Conversation = useMemo(() => {
    return conversations.find(
      (conv) => conv.id === props.channel.conversation_id
    )!;
  }, [conversations, props.channel.conversation_id]);

  const parseContent = useServerParseContent();

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
      onPress={() =>
        router.navigate(`conversation/channel/${props.channel.id}`)
      }
    >
      <View style={styles.channelContainer}>
        <Image style={styles.channelImg} source={DefaultChannelImage} />
        <View style={styles.channelMessageContainer}>
          <MyText style={styles.channelName}>{props.channel.name}</MyText>
          <MyText
            style={TextStyles.bodyM}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {parseContent(conversation.messages[0]?.content)}
          </MyText>
        </View>
      </View>
      <View style={styles.infoContainer}>
        <MyText style={TextStyles.bodyM}>
          {getTimeDifference(conversation.messages[0]?.createdAt)}
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

export default ChannelItem;

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
    gap: 12,
    flex: 1
  },
  infoContainer: {
    gap: 4,
    alignItems: 'flex-end'
  },
  channelImg: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.gray03
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
