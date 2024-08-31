import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View
} from 'react-native';
import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState
} from 'react';
import { router, useNavigation } from 'expo-router';
import { NativeStackHeaderProps } from '@react-navigation/native-stack';

import SearchBar from '@/components/SearchBar';
import GlobalStyles from '@/styles/GlobalStyles';
import { MaterialIcons } from '@expo/vector-icons';
import { colors } from '@/constants/theme';
import ButtonListBase from '@/components/ButtonList/ButtonListBase';
import MemberItem from '@/components/userManagment/MemberItem';
import FilterModal from '@/components/modal/FilterModal';
import MyHeader from '@/components/MyHeader';
import { ProfileStatus, UserProfile } from '@/types';
import TrieSearch from 'trie-search';
import debounce from '@/utils/debounce';
import useServer from '@/hooks/useServer';
import { ServerActions } from '@/context/ServerProvider';

const Members = () => {
  const navigation = useNavigation();
  const { members, latestAction } = useServer();
  const [modalVisible, setModalVisible] = useState(false);
  const [query, setQuery] = useState('');
  const [filteredMembers, setFilteredMembers] = useState<ProfileStatus[]>([]);

  const trie = useRef(new TrieSearch('name')).current;

  const handleSearch = useCallback(
    (query: string) => {
      if (query === '') {
        setFilteredMembers(members);
        return;
      }

      // @ts-ignore
      const results = trie.search(query).map((item) => item.data);
      setFilteredMembers(results);
    },
    [trie, members]
  );

  const debouncedSearch = useMemo(() => debounce(handleSearch), [handleSearch]);

  useEffect(() => {
    switch (latestAction) {
      case ServerActions.SET_MEMBERS:
        trie.reset();
        trie.clearCache();
        trie.addAll(
          members.map((ps) => ({
            name: ps.user_profile.display_name,
            data: ps
          }))
        );
        trie.addAll(
          members.map((ps) => ({
            name: ps.user_profile.username,
            data: ps
          }))
        );
        break;
      case ServerActions.UPDATE_STATUS:
      case ServerActions.UPDATE_PROFILE:
        setFilteredMembers(
          filteredMembers.map((ps) => {
            const member = members.find(
              (m) => m.user_profile.user_id === ps.user_profile.user_id
            );
            return member || ps;
          })
        );
        break;
    }
  }, [members]);

  useEffect(() => {
    debouncedSearch(query);
  }, [query]);

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
          <SearchBar value={query} onChangeText={setQuery} />
        </View>
        <TouchableWithoutFeedback onPress={() => setModalVisible(true)}>
          <MaterialIcons name="filter-alt" size={24} color={colors.gray02} />
        </TouchableWithoutFeedback>
      </View>
      <ScrollView style={{ flex: 1 }}>
        <View style={[GlobalStyles.subcontainer, { paddingBottom: 16 }]}>
          <ButtonListBase
            heading={`${filteredMembers.length} Members`}
            items={filteredMembers.map(({ user_profile, user_status }) => ({
              itemComponent: (
                <MemberItem
                  key={user_profile.user_id}
                  profile={user_profile}
                  status={user_status}
                />
              ),
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
