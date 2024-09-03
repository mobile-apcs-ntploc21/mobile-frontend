import { ScrollView, StyleSheet, View } from 'react-native';
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState
} from 'react';
import { useNavigation } from 'expo-router';
import { NativeStackHeaderProps } from '@react-navigation/native-stack';
import { BottomSheetModal } from '@gorhom/bottom-sheet';

import SearchBar from '@/components/SearchBar';
import GlobalStyles from '@/styles/GlobalStyles';
import ButtonListBase from '@/components/ButtonList/ButtonListBase';
import MyHeader from '@/components/MyHeader';
import UserBanItem from '@/components/userManagment/UserBanItem';
import MyBottomSheetModal from '@/components/modal/MyBottomSheetModal';
import ButtonListText from '@/components/ButtonList/ButtonListText';
import { deleteData, getData } from '@/utils/api';
import useServers from '@/hooks/useServers';
import { showAlert } from '@/services/alert';

interface userBanItem {
  id: string;
  username: string;
  display_name: string;
  avatar_url: string;
}

const Bans = () => {
  const navigation = useNavigation();
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const [bannedUsers, setBannedUsers] = useState<userBanItem[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<userBanItem[]>([]);
  const { currentServerId } = useServers();
  let currentUser: userBanItem = {
    id: '',
    username: '',
    display_name: '',
    avatar_url: ''
  }; // Current user to unban

  const handleOpenBottomSheet = useCallback(
    (user: userBanItem) => {
      currentUser = user;
      bottomSheetModalRef.current?.present();
    },
    [bottomSheetModalRef]
  );

  const handleCloseBottomSheet = useCallback(async () => {
    const result = await handleUnban();
    console.log(result);
    if (result) {
      setBannedUsers(bannedUsers.filter((user) => user.id !== currentUser.id));
      setFilteredUsers(
        filteredUsers.filter((user) => user.id !== currentUser.id)
      );
    }
    bottomSheetModalRef.current?.dismiss();
  }, [bottomSheetModalRef]);

  useLayoutEffect(() => {
    navigation.setOptions({
      header: (props: NativeStackHeaderProps) => (
        <MyHeader {...props} title="Bans" />
      )
    });
  }, []);

  // Fetch the list of banned users
  useEffect(() => {
    (async () => {
      const serverId = currentServerId; // TODO: Replace with actual server ID
      try {
        // Fetch the list of banned users
        const response = await getData(`/api/v1/servers/${serverId}/bans`);

        if (!response) {
          setBannedUsers([]);
          setFilteredUsers([]);
          return;
        }

        const userList = Object.values(await response).map((user: any) => ({
          id: user.user_id,
          username: user.username,
          display_name: user?.display_name ?? user.username,
          avatar_url: user.avatar_url
        }));

        setBannedUsers(userList);
        setFilteredUsers(userList);
      } catch (error) {
        console.log('Error fetching banned users:', error);
      }
    })();
  }, []);

  const handleUnban = async () => {
    const serverId = currentServerId;
    const userId = currentUser.id;
    try {
      const response = await deleteData(
        `/api/v1/servers/${serverId}/bans/${userId}`
      );

      return true;
    } catch (error) {
      showAlert('Cannot unban user, please try again later.');
      return false;
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <MyBottomSheetModal
        ref={bottomSheetModalRef}
        heading={`Unban ${currentUser.username}`}
        onClose={() => {
          console.log('Close bottom modal');
        }}
      >
        <ButtonListText
          items={[{ text: 'Unban', onPress: handleCloseBottomSheet }]}
        />
      </MyBottomSheetModal>
      <View style={[GlobalStyles.subcontainer, styles.searchContainer]}>
        <View style={{ flex: 1 }}>
          <SearchBar
            onChangeText={(text) => {
              setFilteredUsers(
                bannedUsers.filter(
                  (user) =>
                    user.username.toLowerCase().includes(text.toLowerCase()) ||
                    user.display_name.toLowerCase().includes(text.toLowerCase())
                )
              );
            }}
          />
        </View>
      </View>
      <ScrollView style={{ flex: 1 }}>
        <View style={[GlobalStyles.subcontainer, { paddingBottom: 16 }]}>
          {
            <ButtonListBase
              items={filteredUsers.map((user) => ({
                itemComponent: (
                  <UserBanItem
                    username={user.username}
                    display_name={user.display_name}
                    avatarUri={user.avatar_url}
                  />
                ),
                onPress: () => handleOpenBottomSheet(user)
              }))}
            />
          }
        </View>
      </ScrollView>
    </View>
  );
};

export default Bans;

const styles = StyleSheet.create({
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 13,
    marginVertical: 16
  }
});
