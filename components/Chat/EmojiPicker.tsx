import {
  BackHandler,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Image
} from 'react-native';
import React, { useEffect, useMemo, useState } from 'react';
import { Emoji } from '@/types/server';
import SearchBar from '../SearchBar';
import { colors, fonts } from '@/constants/theme';
import MyText from '../MyText';

interface EmojiPickerProps {
  visible: boolean;
  handleClose: () => void;
  height: number;
}

// This should not be mistaken for the ReactionPicker component
const EmojiPicker = (props: EmojiPickerProps) => {
  const [searchQuery, setSearchQuery] = useState('');

  const emojis = useMemo<Emoji[]>(
    () =>
      Array.from({ length: 69 }).map((_, index) => ({
        id: index.toString(),
        name: `emoji-${index}`,
        image_url: `https://via.assets.so/game.png?id=1`,
        uploader_id: '0'
      })),
    []
  );

  const filteredEmojis = useMemo<Emoji[]>(() => {
    const query = searchQuery.trim().toLowerCase();
    return emojis.filter(({ name }) => name.startsWith(query));
  }, [emojis, searchQuery]);

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

  console.log(props.height);

  if (!props.visible) return null;
  return (
    <View style={{ height: props.height, backgroundColor: colors.gray04 }}>
      <View style={styles.searchContainer}>
        <SearchBar value={searchQuery} onChangeText={setSearchQuery} />
      </View>
      <ScrollView contentContainerStyle={styles.list}>
        <MyText style={styles.heading}>Server Emoji</MyText>
        <View style={styles.emojis}>
          {filteredEmojis.map((emoji) => (
            <Image
              style={styles.emoji}
              key={emoji.id}
              source={{ uri: emoji.image_url }}
            />
          ))}
        </View>
      </ScrollView>
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
    width: 24,
    height: 24,
    margin: 8
  },
  emojis: {
    flexDirection: 'row',
    flexWrap: 'wrap'
  }
});
