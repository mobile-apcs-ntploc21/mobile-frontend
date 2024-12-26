import { StyleSheet, Text, View } from 'react-native';
import React, { useEffect, useLayoutEffect, useMemo } from 'react';
import { useLocalSearchParams, useNavigation } from 'expo-router';
import useServer from '@/hooks/useServer';
import useServers from '@/hooks/useServers';
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
import { getData } from '@/utils/api';
import { ConversationsTypes } from '@/types/chat';
import DMChatItem from '@/components/Chat/DMChatItem';
import { useDMContext } from '@/context/DMProvider';
import { useUserContext } from '@/context/UserProvider';
import { useUserById } from '@/hooks/useUserById';

const Pin = () => {
  const navigation = useNavigation();
  const { userId } = useLocalSearchParams<{
    userId: string;
  }>();
  const { data: dmChannels } = useDMContext();
  const channel = useMemo(
    () => dmChannels.find((channel) => channel.user_id === userId),
    [dmChannels, userId]
  );
  const { conversations } = useConversations();
  const conversation = useMemo(() => {
    return conversations.find((conv) => conv.id === channel?.conversation_id);
  }, [conversations, userId])!;

  const { data: userProfile } = useUserContext();
  const { data: otherUserProfile } = useUserById(userId);

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
        data={conversation?.pinned_messages || []}
        renderItem={({ item, index }) => (
          <DMChatItem
            users={[userProfile, otherUserProfile]}
            key={item.id}
            message={item}
            conversation_id={conversation.id}
            onReact={() => {}}
            onUnreact={() => {}}
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
