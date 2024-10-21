import { MyButtonText } from '@/components/MyButton';
import MyHeader from '@/components/MyHeader';
import SearchBar from '@/components/SearchBar';
import { colors } from '@/constants/theme';
import { useAuth } from '@/context/AuthProvider';
import { useConversations } from '@/context/ConversationsProvider';
import useServer from '@/hooks/useServer';
import useServers from '@/hooks/useServers';
import GlobalStyles from '@/styles/GlobalStyles';
import { Channel } from '@/types/server';
import { NativeStackHeaderProps } from '@react-navigation/native-stack';
import { router, useLocalSearchParams, useNavigation } from 'expo-router';
import { useLayoutEffect, useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';

const Search = () => {
  const navigation = useNavigation();
  const { currentServerId } = useServers();
  const { categories, roles, members, emojis, permissions } = useServer();
  const { user } = useAuth();
  const channels = useMemo(() => {
    return categories.map((category) => category.channels).flat();
  }, [categories]);
  const { channelId } = useLocalSearchParams<{
    channelId: string;
  }>();
  const channel: Channel | undefined = useMemo(() => {
    return channels.find((channel) => channel.id === channelId);
  }, [channels, channelId]);
  const { conversations, dispatch: conversationDispatch } = useConversations();
  const conversation = useMemo(() => {
    return conversations.find((conv) => conv.id === channel?.conversation_id);
  }, [conversations, channelId])!;

  const [searchText, setSearchText] = useState('');

  useLayoutEffect(() => {
    const channelName = channel?.name;
    navigation.setOptions({
      header: (props: NativeStackHeaderProps) => (
        <MyHeader {...props} title="Search" />
      )
    });
  });

  const getSearchParams = () => {
    return {
      content: searchText,
      in: channelId
    };
  };

  return (
    <View style={styles.screen}>
      <View style={styles.container}>
        <View style={styles.searchContainer}>
          <SearchBar value={searchText} onChangeText={setSearchText} />
        </View>
      </View>
      <View style={styles.searchButtonContainer}>
        <MyButtonText
          title="Search"
          onPress={() => {
            router.navigate({
              pathname: './search-results',
              params: getSearchParams()
            });
          }}
          containerStyle={styles.searchButton}
        />
      </View>
    </View>
  );
};

export default Search;

const styles = StyleSheet.create({
  screen: {
    ...GlobalStyles.screen,
    justifyContent: 'space-between'
  },
  container: {},
  searchContainer: {
    padding: 16
  },
  searchButtonContainer: {
    padding: 16
  },
  searchButton: {
    alignSelf: 'center',
    color: colors.primary,
    width: '100%'
  }
});
