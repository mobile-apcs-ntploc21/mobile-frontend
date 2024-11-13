import {
  BackHandler,
  ScrollView,
  StyleSheet,
  Text,
  View,
  LayoutChangeEvent,
  useWindowDimensions
} from 'react-native';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Emoji } from '@/types/server';
import SearchBar from '../SearchBar';
import { colors, fonts } from '@/constants/theme';
import MyText from '../MyText';
import useServer from '@/hooks/useServer';
import { FlatList, TouchableOpacity } from 'react-native-gesture-handler';
import useServers from '@/hooks/useServers';
import { Server } from '@/types';
import { Image } from 'expo-image';

interface EmojiPickerProps {
  visible: boolean;
  handleClose: () => void;
  height: number;
  onSelect: (emoji: Emoji) => void;
  importedEmojiCategories?: {
    id: string;
    name: string;
    emojis: Emoji[];
  }[];
}

const placeholderImg = 'https://via.placeholder.com/150';

const EmojiItemMemo = React.memo(
  ({ emoji, onSelect }: { emoji: Emoji; onSelect: () => void }) => {
    return (
      <TouchableOpacity onPress={onSelect}>
        {emoji.image_url ? (
          <Image style={styles.emoji} source={{ uri: emoji.image_url }} />
        ) : (
          <Text style={styles.emojiUnicode}>{emoji.unicode}</Text>
        )}
      </TouchableOpacity>
    );
  }
);

// This should not be mistaken for the ReactionPicker component
const EmojiPicker = (props: EmojiPickerProps) => {
  const { width } = useWindowDimensions();

  const { servers, currentServerId } = useServers();

  const emojiCategories =
    props.importedEmojiCategories || useServers().emojiCategories;

  const [searchQuery, setSearchQuery] = useState('');

  // const filteredEmojis = useMemo<Emoji[]>(() => {
  //   const query = searchQuery.trim().toLowerCase();
  //   return emojis.filter(({ name }) => name.startsWith(query));
  // }, [emojis, searchQuery]);

  const filteredCategories = useMemo<
    {
      name: string;
      emojis?: Emoji[];
      id: string;
    }[]
  >(() => {
    const query = searchQuery.trim().toLowerCase();
    return emojiCategories.map((category) => ({
      ...category,
      emojis: category.emojis?.filter(({ name }) => name.startsWith(query))
    }));
  }, [emojiCategories, searchQuery]);

  console.log('rendering emoji picker');

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      () => {
        if (props.visible) {
          props.handleClose();
          return true;
        }
        return false;
      }
    );
    return () => backHandler.remove();
  }, [props.visible]);

  const emojiListRef = useRef<
    FlatList<{
      name: string;
      emojis?: Emoji[];
      id: string;
    }>
  >(null);

  const scrollToSection = (index: number) => {
    emojiListRef.current?.scrollToIndex({ index });
  };

  if (!props.visible) return null;
  return (
    <View style={{ height: props.height, backgroundColor: colors.gray04 }}>
      <View style={styles.searchContainer}>
        <SearchBar value={searchQuery} onChangeText={setSearchQuery} />
      </View>
      <FlatList
        ref={emojiListRef}
        data={filteredCategories}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) =>
          item.emojis?.length ? (
            <View>
              <MyText style={styles.heading}>{item.name}</MyText>
              <FlatList
                data={item.emojis}
                keyExtractor={(emoji) => emoji.id}
                numColumns={Math.floor(width / 48)}
                renderItem={({ item: emoji }) => (
                  <EmojiItemMemo
                    emoji={emoji}
                    onSelect={() => props.onSelect(emoji)}
                  />
                )}
              />
            </View>
          ) : null
        }
      />
      <View style={styles.serverListContainer}>
        <FlatList
          data={servers}
          keyExtractor={(item) => item.id}
          horizontal
          renderItem={({ index, item }) => (
            <TouchableOpacity onPress={() => scrollToSection(index)}>
              <Image
                style={styles.serverAvatar}
                source={{ uri: item.avatar || placeholderImg }}
              />
            </TouchableOpacity>
          )}
        />
      </View>
    </View>
  );
};

export default React.memo(EmojiPicker);

const styles = StyleSheet.create({
  searchContainer: {
    padding: 8
  },
  list: {
    paddingBottom: 8
  },
  heading: {
    marginLeft: 16,
    fontSize: 12,
    fontFamily: fonts.bold
  },
  emoji: {
    width: 32,
    height: 32,
    margin: 8
  },
  emojiUnicode: {
    fontSize: 24,
    margin: 8
  },
  emojis: {
    flexDirection: 'row',
    flexWrap: 'wrap'
  },
  serverListContainer: {
    borderTopWidth: 1,
    borderTopColor: colors.gray03
  },
  serverAvatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    margin: 8
  }
});
