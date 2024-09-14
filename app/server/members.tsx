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
import { ServerProfile, UserProfile } from '@/types';
import debounce from '@/utils/debounce';
import useServer from '@/hooks/useServer';
import { ServerActions } from '@/context/ServerProvider';
import { useAuth } from '@/context/AuthProvider';
import { isAdmin } from '@/utils/user';

const Members = () => {
  const navigation = useNavigation();
  const { members } = useServer();
  const { user } = useAuth();
  const [modalVisible, setModalVisible] = useState(false);
  const [query, setQuery] = useState('');
  const [filteredMembers, setFilteredMembers] = useState<ServerProfile[]>([]);

  const handleSearch = useCallback(
    (query: string) => {
      query = query.trim().toLowerCase();

      if (query === '') {
        setFilteredMembers(members);
        return;
      }

      const results = members.filter(
        (member) =>
          member.display_name.toLowerCase().startsWith(query) ||
          member.username.toLowerCase().startsWith(query)
      );
      // @ts-ignore
      setFilteredMembers(results);
    },
    [members]
  );

  const debouncedSearch = useMemo(() => debounce(handleSearch), [handleSearch]);

  useEffect(() => {
    if (query === '') setFilteredMembers(members);
    else
      setFilteredMembers(
        filteredMembers
          ?.map((ps) => {
            const member = members.find((m) => m.user_id === ps.user_id);
            return member || null;
          })
          .filter((m): m is ServerProfile => m !== null)
      );
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
        onClose={(roleIds: string[], justClose: boolean = true) => {
          if (!justClose) {
            if (roleIds.length === 0) setFilteredMembers(members);
            else
              setFilteredMembers(
                members.filter((member) => {
                  return member.roles.some((role) => roleIds.includes(role.id));
                })
              );
          }
          setModalVisible(false);
        }}
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
            items={filteredMembers?.map((member) => ({
              itemComponent: (
                <MemberItem key={member.user_id} profile={member} />
              ),
              onPress: () => {
                if (!isAdmin(members.find((m) => m.user_id === user.id)!))
                  return;
                router.navigate(`/server/edit-member/${member.user_id}`);
              }
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
