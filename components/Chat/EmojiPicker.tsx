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
import useServer from '@/hooks/useServer';
import { TouchableOpacity } from 'react-native-gesture-handler';
import useServers from '@/hooks/useServers';

interface EmojiPickerProps {
  visible: boolean;
  handleClose: () => void;
  height: number;
  onSelect: (emoji: Emoji) => void;
  emojis: Emoji[];
}

// This should not be mistaken for the ReactionPicker component
const EmojiPicker = (props: EmojiPickerProps) => {
  const { emojis } = props;

  const [searchQuery, setSearchQuery] = useState('');

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
            <TouchableOpacity
              onPress={() => props.onSelect(emoji)}
              key={emoji.id}
            >
              <Image style={styles.emoji} source={{ uri: emoji.image_url }} />
            </TouchableOpacity>
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
    width: 32,
    height: 32,
    margin: 8
  },
  emojis: {
    flexDirection: 'row',
    flexWrap: 'wrap'
  }
});
