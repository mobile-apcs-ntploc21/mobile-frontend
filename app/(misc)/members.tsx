import { StyleSheet, Text, TouchableWithoutFeedback, View } from 'react-native';
import React, { useLayoutEffect, useState } from 'react';
import { useNavigation } from 'expo-router';
import { NativeStackHeaderProps } from '@react-navigation/native-stack';

import SearchBar from '@/components/SearchBar';
import GlobalStyles from '@/styles/GlobalStyles';
import { MaterialIcons } from '@expo/vector-icons';
import { colors } from '@/constants/theme';
import ButtonListBase from '@/components/ButtonList/ButtonListBase';
import MyText from '@/components/MyText';
import MemberItem from '@/components/MemberItem';
import Header from '@/components/Header';
import FilterModal from '@/components/modal/FilterModal';
import MyHeader from '@/components/MyHeader';

const Members = () => {
  const navigation = useNavigation();
  const [modalVisible, setModalVisible] = useState(false);

  useLayoutEffect(() => {
    navigation.setOptions({
      header: (props: NativeStackHeaderProps) => (
        <MyHeader {...props} title="Members" />
      )
    });
  }, []);

  return (
    // Make sure parents of a scrollview have bounded height
    <View style={{ flex: 1 }}>
      <FilterModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
      />
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
