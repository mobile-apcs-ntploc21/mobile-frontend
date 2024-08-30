import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View
} from 'react-native';
import React, { useEffect, useLayoutEffect, useState } from 'react';
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
import { UserProfile } from '@/types';
import useServers from '@/hooks/useServers';
import { getData } from '@/utils/api';

const Members = () => {
  const navigation = useNavigation();
  const { members } = useServers();
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
            heading={`${members.length} Members`}
            items={members.map(({ user_id }) => ({
              itemComponent: <MemberItem id={user_id} />,
              onPress: () => router.navigate('./edit_member')
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
