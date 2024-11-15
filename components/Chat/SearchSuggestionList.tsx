import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import MyText from '../MyText';
import { FlatList, TouchableOpacity } from 'react-native';
import { colors, fonts } from '@/constants/theme';

interface SearchSuggestionListProps {
  heading?: string;
  items: {
    text: string;
    subText?: string;
    onPress?: () => void;
  }[];
}

const SearchSuggestionList = (props: SearchSuggestionListProps) => {
  return (
    <View style={styles.container}>
      <MyText style={styles.heading}>{props.heading}</MyText>
      <FlatList
        style={styles.list}
        data={props.items}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.item} onPress={item.onPress}>
            <MyText style={styles.text}>{item.text}</MyText>
            <MyText style={styles.subText}>{item.subText}</MyText>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

export default SearchSuggestionList;

const styles = StyleSheet.create({
  container: {
    paddingVertical: 16,
    gap: 8,
    flex: 1
  },
  heading: {
    fontSize: 14,
    fontFamily: fonts.bold,
    textTransform: 'uppercase',
    marginLeft: 16
  },
  list: {},
  item: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    paddingVertical: 8,
    gap: 8
  },
  text: {
    fontSize: 16
  },
  subText: {
    fontSize: 16,
    color: colors.gray02
  }
});
