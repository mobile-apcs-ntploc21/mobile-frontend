import { StyleSheet, Text, TextInput, View } from 'react-native';
import React from 'react';
import { TextStyles } from '@/styles/TextStyles';
import { colors } from '@/constants/theme';
import { AntDesign, MaterialIcons } from '@expo/vector-icons';

export interface SearchBarProps {
  value?: string;
  placeholder?: string;
  onChangeText?: (text: string) => void;
}

const SearchBar = (props: SearchBarProps) => {
  return (
    <View style={styles.container}>
      <AntDesign name="search1" size={24} color={colors.gray01} />
      <TextInput
        style={styles.input}
        value={props.value}
        onChangeText={props.onChangeText}
        placeholder={props.placeholder || 'Search'}
      />
    </View>
  );
};

export default SearchBar;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    height: 32,
    backgroundColor: colors.gray03,
    borderRadius: 999,
    gap: 10
  },
  input: {
    ...TextStyles.bodyL,
    flex: 1
  }
});
