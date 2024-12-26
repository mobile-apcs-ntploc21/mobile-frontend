import DMChatItem from '@/components/Chat/DMChatItem';
import ServerChatItem from '@/components/Chat/ServerChatItem';
import { MyButtonText } from '@/components/MyButton';
import MyHeader from '@/components/MyHeader';
import MyText from '@/components/MyText';
import SearchBar from '@/components/SearchBar';
import { colors } from '@/constants/theme';
import { useAuth } from '@/context/AuthProvider';
import { useConversations } from '@/context/ConversationsProvider';
import { useDMContext } from '@/context/DMProvider';
import { useUserContext } from '@/context/UserProvider';
import useServer from '@/hooks/useServer';
import useServers from '@/hooks/useServers';
import { useUserById } from '@/hooks/useUserById';
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
  const { userId, content, additionalParams } = useLocalSearchParams<{
    userId: string;
    content?: string;
    additionalParams?: string;
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
    const channelName = channel?.name;
    navigation.setOptions({
      header: (props: NativeStackHeaderProps) => (
        <MyHeader {...props} title="Search results" />
      )
    });
  });

  const [searchResults, setSearchResults] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [messageEndReached, setMessageEndReached] = useState(false);

  const fetchMessages = async () => {
    if (loading) return;
    if (messageEndReached) return;
    setLoading(true);
    const response = await getData(
      `/api/v1/direct-messages/${userId}/messages/search?content=${content}&page=${currentPage}${
        additionalParams ? `&${additionalParams}` : ''
      }`
    );
    if (response.messages.length === 0) {
      setMessageEndReached(true);
      setLoading(false);
      return;
    }
    setSearchResults((prev) => [...prev, ...response.messages]);
    setCurrentPage(currentPage + 1);
    setLoading(false);
  };

  useEffect(() => {
    (async () => {
      await fetchMessages();
    })();
  }, []);

  return (
    <View style={styles.screen}>
      {searchResults.length === 0 && !loading && (
        <View style={styles.emptyContainer}>
          <MyText style={styles.emptyText}>No results found</MyText>
        </View>
      )}
      <FlatList
        keyboardShouldPersistTaps="never"
        data={searchResults}
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
        ListFooterComponent={loading ? <ActivityIndicator /> : null}
        onEndReached={fetchMessages}
      />
    </View>
  );
};

export default SearchResults;

const styles = StyleSheet.create({
  screen: {
    ...GlobalStyles.screen
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    padding: 16
  },
  emptyText: {
    fontSize: 16,
    color: colors.gray02
  }
});
