import ServerChatItem from '@/components/Chat/ServerChatItem';
import { MyButtonText } from '@/components/MyButton';
import MyHeader from '@/components/MyHeader';
import SearchBar from '@/components/SearchBar';
import { colors } from '@/constants/theme';
import { useAuth } from '@/context/AuthProvider';
import { useConversations } from '@/context/ConversationsProvider';
import useServer from '@/hooks/useServer';
import useServers from '@/hooks/useServers';
import GlobalStyles from '@/styles/GlobalStyles';
import { Message } from '@/types/chat';
import { Channel } from '@/types/server';
import { getData } from '@/utils/api';
import { NativeStackHeaderProps } from '@react-navigation/native-stack';
import { useLocalSearchParams, useNavigation } from 'expo-router';
import { useEffect, useLayoutEffect, useMemo, useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';

const SearchResults = () => {
  const navigation = useNavigation();
  const { currentServerId } = useServers();
  const { categories, roles, members, emojis, permissions } = useServer();
  const { user } = useAuth();
  const channels = useMemo(() => {
    return categories.map((category) => category.channels).flat();
  }, [categories]);
  const { channelId, content, additionalParams } = useLocalSearchParams<{
    channelId: string;
    content?: string;
    additionalParams?: string;
  }>();
  const channel: Channel | undefined = useMemo(() => {
    return channels.find((channel) => channel.id === channelId);
  }, [channels, channelId]);
  const { conversations, dispatch: conversationDispatch } = useConversations();
  const conversation = useMemo(() => {
    return conversations.find((conv) => conv.id === channel?.conversation_id);
  }, [conversations, channelId])!;

  useLayoutEffect(() => {
    const channelName = channel?.name;
    navigation.setOptions({
      header: (props: NativeStackHeaderProps) => (
        <MyHeader {...props} title="Search results" />
      )
    });
  });

  const [searchResults, setSearchResults] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    (async () => {
      const response = await getData(
        `/api/v1/servers/${currentServerId}/messages/search?content=${content}${
          additionalParams ? `&${additionalParams}` : ''
        }`
      );
      setSearchResults(response.messages);
      setLoading(false);
    })();
  }, [content, additionalParams]);

  return (
    <View style={styles.screen}>
      <FlatList
        keyboardShouldPersistTaps="never"
        data={searchResults}
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
        // ListFooterComponent={loading ? <ActivityIndicator /> : null}
        // onEndReached={fetchMessages}
      />
    </View>
  );
};

export default SearchResults;

const styles = StyleSheet.create({
  screen: {
    ...GlobalStyles.screen
  }
});
