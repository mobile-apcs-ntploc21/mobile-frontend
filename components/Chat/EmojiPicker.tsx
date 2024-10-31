import {
  BackHandler,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Image,
  LayoutChangeEvent
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

interface EmojiPickerProps {
  visible: boolean;
  handleClose: () => void;
  height: number;
  onSelect: (emoji: Emoji) => void;
  emojis: Emoji[];
}

const placeholderImg = 'https://via.placeholder.com/150';

// This should not be mistaken for the ReactionPicker component
const EmojiPicker = (props: EmojiPickerProps) => {
  const { servers } = useServers();

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
    return servers.map((server) => ({
      ...server,
      emojis: server.emojis?.filter(({ name }) => name.startsWith(query))
    }));
  }, [servers, searchQuery]);

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
              <View style={styles.emojis}>
                {item.emojis?.map((emoji) => (
                  <TouchableOpacity
                    onPress={() => props.onSelect(emoji)}
                    key={emoji.id}
                  >
                    <Image
                      style={styles.emoji}
                      source={{ uri: emoji.image_url }}
                    />
                  </TouchableOpacity>
                ))}
              </View>
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

export default EmojiPicker;

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
