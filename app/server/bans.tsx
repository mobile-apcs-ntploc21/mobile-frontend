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
import { getData } from '@/utils/api';
import useServers from '@/hooks/useServers';

type userBanItem = {
  id: number;
  username: string;
  avatar_url: string;
};

const Bans = () => {
  const navigation = useNavigation();
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const [bannedUsers, setBannedUsers] = useState<userBanItem[]>([]);
  const { currentServerId } = useServers();

  const handleOpenBottomSheet = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, [bottomSheetModalRef]);

  const handleCloseBottomSheet = useCallback(() => {
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
        const response = await getData(`/api/v1/servers/{serverId}/bans`);

        if (!response) {
          return;
        }

        const userList = Object.values(response).map((user: any) => ({
          id: user.id,
          username: user.username,
          avatar_url: user.avatar_url
        }));

        setBannedUsers(userList);
      } catch (error) {
        console.log('Error fetching banned users:', error);
      }
    })();
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <MyBottomSheetModal
        ref={bottomSheetModalRef}
        heading="username"
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
          <SearchBar />
        </View>
      </View>
      <ScrollView style={{ flex: 1 }}>
        <View style={[GlobalStyles.subcontainer, { paddingBottom: 16 }]}>
          {/* <ButtonListBase
            items={Array.from({ length: 20 }, (_, index) => ({
              itemComponent: <UserBanItem />,
              onPress: handleOpenBottomSheet
            }))}
          /> */}
          {
            <ButtonListBase
              items={bannedUsers.map((user) => ({
                itemComponent: (
                  <UserBanItem
                    username={user.username}
                    avatarUri={user.avatar_url}
                  />
                ),
                onPress: handleOpenBottomSheet
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
