import SearchSuggestionList from '@/components/Chat/SearchSuggestionList';
import { MyButtonText } from '@/components/MyButton';
import MyHeader from '@/components/MyHeader';
import SearchBar from '@/components/SearchBar';
import { colors } from '@/constants/theme';
import { useAuth } from '@/context/AuthProvider';
import { useConversations } from '@/context/ConversationsProvider';
import useServer from '@/hooks/useServer';
import useServers from '@/hooks/useServers';
import * as Crypto from 'expo-crypto';
import GlobalStyles from '@/styles/GlobalStyles';
import { Channel } from '@/types/server';
import { NativeStackHeaderProps } from '@react-navigation/native-stack';
import { router, useLocalSearchParams, useNavigation } from 'expo-router';
import { useLayoutEffect, useMemo, useState } from 'react';
import {
  NativeSyntheticEvent,
  StyleSheet,
  TextInputSelectionChangeEventData,
  View
} from 'react-native';
import MyText from '@/components/MyText';
import IconWithSize from '@/components/IconWithSize';
import CrossIcon from '@/assets/icons/CrossIcon';
import { TouchableOpacity } from 'react-native-gesture-handler';

const SearchOptions = [
  {
    text: 'from:',
    subText: 'user'
  },
  {
    text: 'mentions:',
    subText: 'user or role'
  },
  {
    text: 'has:',
    subText: 'file, audio, image, or video'
  }
];

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

  useLayoutEffect(() => {
    const channelName = channel?.name;
    navigation.setOptions({
      header: (props: NativeStackHeaderProps) => (
        <MyHeader {...props} title="Search" />
      )
    });
  });
  const [searchText, setSearchText] = useState('');
  const [searchMode, setSearchMode] = useState<
    null | 'from' | 'mentions' | 'has'
  >(null);
  const [selectedOptions, setSelectedOptions] = useState<
    {
      id: string;
      label: string;
      key: string;
      value: string;
    }[]
  >([]);

  const handleInputChange = (text: string) => {
    setSearchText(text);
    setSearchMode(null);
    SearchOptions.forEach((option) => {
      if (text.startsWith(option.text)) {
        setSearchMode(
          option.text.replace(':', '') as 'from' | 'mentions' | 'has'
        );
      }
    });
  };

  const renderSuggestions = useMemo(
    () => () => {
      let heading = '';
      let items: {
        text: string;
        subText?: string;
        onPress?: () => void;
      }[] = [];

      const filterContent = searchText
        .slice(searchText.indexOf(':') + 1)
        .trim()
        .toLocaleLowerCase();
      const prefixMatch = (text: string) => {
        return text.toLocaleLowerCase().startsWith(filterContent);
      };

      const insertOptions = (key: string, value: string, label: string) => {
        handleInputChange('');
        setSelectedOptions((prev) => [
          ...prev,
          {
            id: Crypto.randomUUID(),
            key,
            value,
            label
          }
        ]);
      };

      switch (searchMode) {
        case 'from':
          heading = 'From user';
          items = members
            .map((member) => ({
              text: member.display_name,
              subText: member.username,
              onPress: () =>
                insertOptions(
                  'author_id',
                  member.user_id,
                  `from: ${member.username}`
                )
            }))
            .filter(
              (option) =>
                prefixMatch(option.text) || prefixMatch(option.subText)
            );
          break;
        case 'mentions':
          heading = 'Mentions user or role';
          items = [
            ...members.map((member) => ({
              text: member.display_name,
              subText: member.username,
              onPress: () =>
                insertOptions(
                  'mentions',
                  member.user_id,
                  `mentions: ${member.username}`
                )
            })),
            ...roles.map((role) => ({
              text: role.name,
              subText: undefined,
              onPress: () =>
                insertOptions('mentions', role.id, `mentions: ${role.name}`)
            }))
          ].filter(
            (option) =>
              prefixMatch(option.text) || prefixMatch(option.subText || '')
          );
          break;
        case 'has':
          heading = 'Message contains';
          items = ['file', 'audio', 'image', 'video']
            .map((type) => ({
              text: type,
              onPress: () => insertOptions('has', type, `has: ${type}`)
            }))
            .filter((option) => prefixMatch(option.text));
          break;
        default:
          heading = 'Search options';
          items = SearchOptions.map((option) => ({
            ...option,
            onPress: () => {
              handleInputChange(option.text + ' ');
            }
          })).filter((option) =>
            option.text.startsWith(searchText.toLocaleLowerCase())
          );
      }
      return <SearchSuggestionList heading={heading} items={items} />;
    },
    [searchText, searchMode]
  );

  const getSearchParams = () => {
    const additionalParams = new URLSearchParams();
    additionalParams.append('in', channelId!);
    selectedOptions.forEach((option) => {
      additionalParams.append(option.key, option.value);
    });
    return {
      content: searchText,
      additionalParams: additionalParams.toString()
    };
  };

  return (
    <View style={styles.screen}>
      <View style={styles.container}>
        <View style={styles.searchContainer}>
          <View style={styles.optionsContainer}>
            {selectedOptions.map((option) => (
              <TouchableOpacity
                style={styles.option}
                key={option.id}
                onPress={() => {
                  setSelectedOptions((prev) =>
                    prev.filter((item) => item.id !== option.id)
                  );
                }}
              >
                <MyText style={styles.optionText}>{option.label}</MyText>
                <IconWithSize icon={CrossIcon} size={16} />
              </TouchableOpacity>
            ))}
          </View>
          <SearchBar value={searchText} onChangeText={handleInputChange} />
        </View>
        {renderSuggestions()}
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
  container: {
    flex: 1
  },
  searchContainer: {
    padding: 16,
    gap: 8
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    gap: 8,
    backgroundColor: colors.gray04,
    borderRadius: 999
  },
  optionText: {
    fontSize: 12
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
