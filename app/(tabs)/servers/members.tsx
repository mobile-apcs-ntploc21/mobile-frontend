import { StyleSheet, Text, TouchableWithoutFeedback, View } from 'react-native';
import React, { useState } from 'react';
import SearchBar from '@/components/SearchBar';
import GlobalStyles from '@/styles/GlobalStyles';
import { MaterialIcons } from '@expo/vector-icons';
import { colors } from '@/constants/theme';
import ButtonListBase from '@/components/ButtonList/ButtonListBase';
import MyText from '@/components/MyText';
import MemberItem from '@/components/MemberItem';
import Header from '@/components/Header';
import FilterModal from '@/components/modal/FilterModal';

const Members = () => {
  const [modalVisible, setModalVisible] = useState(false);
  return (
    <View>
      <FilterModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
      />
      <Header title="Members" />
      <View style={GlobalStyles.container}>
        <View style={styles.searchContainer}>
          <View style={{ flex: 1 }}>
            <SearchBar />
          </View>
          <TouchableWithoutFeedback onPress={() => setModalVisible(true)}>
            <MaterialIcons name="filter-alt" size={24} color={colors.gray02} />
          </TouchableWithoutFeedback>
        </View>
        <ButtonListBase
          heading="4 Members"
          items={Array.from({ length: 4 }, (_, index) => ({
            itemComponent: <MemberItem />,
            onPress: () => console.log(`Item ${index} pressed`)
          }))}
        />
      </View>
    </View>
  );
};

export default Members;

const styles = StyleSheet.create({
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 13,
    marginVertical: 16
  }
});
