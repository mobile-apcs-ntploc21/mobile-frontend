import { StyleSheet, Text, View } from 'react-native';
import React, { useLayoutEffect, useMemo } from 'react';
import { useLocalSearchParams, useNavigation } from 'expo-router';
import useServer from '@/hooks/useServer';
import { Channel } from '@/types/server';
import { NativeStackHeaderProps } from '@react-navigation/native-stack';
import MyHeader from '@/components/MyHeader';
import GlobalStyles from '@/styles/GlobalStyles';
import { Image } from 'expo-image';
import { DefaultChannelImage } from '@/constants/images';
import ButtonListText from '@/components/ButtonList/ButtonListText';
import { TextStyles } from '@/styles/TextStyles';
import { FlatList } from 'react-native-gesture-handler';
import { useConversations } from '@/context/ConversationsProvider';
import ServerChatItem from '@/components/Chat/ServerChatItem';

const Pin = () => {
  const navigation = useNavigation();
  const { categories } = useServer();
  const { channelId } = useLocalSearchParams<{
    channelId: string;
  }>();
  const channel: Channel | undefined = useMemo(() => {
    return categories
      .map((category) => category.channels)
      .flat()
      .find((channel) => channel.id === channelId);
  }, [categories, channelId]);
  const { conversations } = useConversations();
  const conversation = useMemo(() => {
    return conversations.find((conv) => conv.id === channel?.conversation_id);
  }, [conversations, channelId])!;

  useLayoutEffect(() => {
    navigation.setOptions({
      header: (props: NativeStackHeaderProps) => (
        <MyHeader {...props} title="Pinned mesages" />
      )
    });
  });
  return (
    <View style={GlobalStyles.screen}>
      <FlatList
        keyboardShouldPersistTaps="never"
        data={conversation?.messages || []} // This is just for mock data, it should be pinned messages
        renderItem={({ item, index }) => (
          <ServerChatItem
            channel_id={channelId!}
            key={item.id}
            message={item}
            conversation_id={conversation.id}
          />
        )}
        contentContainerStyle={{ gap: 8 }}
        keyExtractor={(item, index) => index.toString()}
      />
    </View>
  );
};

export default Pin;

const styles = StyleSheet.create({
  container: {
    padding: 16,
    gap: 16
  },
  infoContainer: {
    alignItems: 'center',
    gap: 8
  },
  channelImg: {
    width: 80,
    height: 80
  },
  channelName: {
    ...TextStyles.h2
  }
});
