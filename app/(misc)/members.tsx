import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View
} from 'react-native';
import React, { useLayoutEffect, useState } from 'react';
import { router, useNavigation } from 'expo-router';
import { NativeStackHeaderProps } from '@react-navigation/native-stack';

import SearchBar from '@/components/SearchBar';
import GlobalStyles from '@/styles/GlobalStyles';
import { MaterialIcons } from '@expo/vector-icons';
import { colors } from '@/constants/theme';
import ButtonListBase from '@/components/ButtonList/ButtonListBase';
import MyText from '@/components/MyText';
import MemberItem from '@/components/userManagment/MemberItem';
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
    <View style={{ flex: 1, marginTop: 16 }}>
      <FilterModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
      />
      <View style={[GlobalStyles.subcontainer, styles.searchContainer]}>
        <View style={{ flex: 1 }}>
          <SearchBar />
        </View>
        <TouchableWithoutFeedback onPress={() => setModalVisible(true)}>
          <MaterialIcons name="filter-alt" size={24} color={colors.gray02} />
        </TouchableWithoutFeedback>
      </View>
      <ScrollView style={{ flex: 1 }}>
        <View style={[GlobalStyles.subcontainer, { paddingBottom: 16 }]}>
          <ButtonListBase
            heading="4 Members"
            items={Array.from({ length: 10 }, (_, index) => ({
              itemComponent: <MemberItem />,
              onPress: () => router.navigate('/edit-member')
            }))}
          />
        </View>
      </ScrollView>
    </View>
  );
};

export default Members;

const styles = StyleSheet.create({
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 13,
    marginBottom: 16
  }
});
