import { StyleSheet, Text, TouchableWithoutFeedback, View } from 'react-native';
import React from 'react';
import SearchBar from '@/components/SearchBar';
import GlobalStyles from '@/styles/GlobalStyles';
import { MaterialIcons } from '@expo/vector-icons';
import { colors } from '@/constants/theme';

const Members = () => {
  return (
    <View style={GlobalStyles.container}>
      <Text>Members 123</Text>
      <View style={styles.searchContainer}>
        <View style={{ flex: 1 }}>
          <SearchBar />
        </View>
        <TouchableWithoutFeedback>
          <MaterialIcons name="filter-alt" size={24} color={colors.gray02} />
        </TouchableWithoutFeedback>
      </View>
    </View>
  );
};

export default Members;

const styles = StyleSheet.create({
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 13
  }
});
