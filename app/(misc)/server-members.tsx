import { FlatList, StyleSheet, Text, View } from 'react-native';
import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState
} from 'react';
import { router, useNavigation } from 'expo-router';
import MyHeader from '@/components/MyHeader';
import { NativeStackHeaderProps } from '@react-navigation/native-stack';
import GlobalStyles from '@/styles/GlobalStyles';
import ButtonListBase from '@/components/ButtonList/ButtonListBase';
import Avatar from '@/components/Avatar';
import { StatusType } from '@/types/user_status';
import { colors, fonts } from '@/constants/theme';
import { BottomSheetModal, BottomSheetScrollView } from '@gorhom/bottom-sheet';
import MyBottomSheetModal from '@/components/modal/MyBottomSheetModal';
import ButtonListText from '@/components/ButtonList/ButtonListText';
import { ScrollView } from 'react-native-gesture-handler';
import MemberListItem from '@/components/userManagment/MemberListItem';
import useServer from '@/hooks/useServer';
import { ServerProfile } from '@/types';
import MyText from '@/components/MyText';
import { Role } from '@/types/server';

const ServerMembers = () => {
  const navigation = useNavigation();
  const { members, roles } = useServer();
  const [onlineMembers, setOM] = useState<ServerProfile[]>([]);
  const [offlineMembers, setOFM] = useState<ServerProfile[]>([]);
  const [modalUser, setModalUser] = useState<ServerProfile | null>(null);
  const [modalUserRoles, setModalUserRoles] = useState<Role[]>([]);

  useEffect(() => {
    if (modalUser) {
      const userRoles: Role[] = [];
      modalUser.roleIds.forEach((roleId) => {
        const role = roles.get(roleId)!;
        if (!role.default) userRoles.push(role);
      });
      setModalUserRoles(userRoles);
    }
  }, [modalUser, roles]);

  useEffect(() => {
    const onlineMembers: ServerProfile[] = [];
    const offlineMembers: ServerProfile[] = [];
    members.forEach((member) => {
      if (
        member.status.is_online &&
        ![StatusType.INVISIBLE, StatusType.OFFLINE].includes(member.status.type)
      ) {
        onlineMembers.push(member);
      } else {
        offlineMembers.push(member);
      }
    });
    setOM(onlineMembers);
    setOFM(offlineMembers);
  }, [members]);

  useLayoutEffect(() => {
    navigation.setOptions({
      header: (props: NativeStackHeaderProps) => (
        <MyHeader {...props} title="All Members" />
      )
    });
  }, []);

  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  const handleOpenBottomSheet = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, [bottomSheetModalRef]);

  const handleCloseBottomSheet = useCallback(() => {
    bottomSheetModalRef.current?.dismiss();
  }, [bottomSheetModalRef]);

  return (
    <View style={GlobalStyles.screenGray}>
      <MyBottomSheetModal
        ref={bottomSheetModalRef}
        onClose={handleCloseBottomSheet}
        heading={modalUser?.username}
      >
        <View style={styles.bottomSheetContainer}>
          <View style={styles.rolesContainer}>
            <Text style={styles.rolesText}>Roles</Text>
            <FlatList
              data={modalUserRoles}
              keyExtractor={(role) => role.id}
              renderItem={({ item }) => (
                <View style={styles.roleItem}>
                  <View
                    style={{
                      ...styles.roleDot,
                      backgroundColor: item.color
                    }}
                  />
                  <MyText style={styles.roleTitle}>{item.name}</MyText>
                </View>
              )}
              horizontal
              contentContainerStyle={styles.roles}
              showsHorizontalScrollIndicator={false}
              ListEmptyComponent={
                <MyText>There is no role assigned to this member.</MyText>
              }
            />
          </View>
          <ButtonListText
            items={[
              {
                text: 'View Profile',
                onPress: () => {
                  handleCloseBottomSheet();
                  router.navigate(`/user/${modalUser?.user_id}`);
                }
              },
              {
                text: 'Edit Member',
                onPress: () => {
                  handleCloseBottomSheet();
                  router.navigate(`/server/edit-member/${modalUser?.user_id}`);
                }
              }
            ]}
          />
        </View>
      </MyBottomSheetModal>
      <ScrollView contentContainerStyle={{ padding: 16, gap: 16 }}>
        <ButtonListBase
          heading={`(${onlineMembers.length}) Online`}
          items={onlineMembers.map((member) => ({
            itemComponent: (
              <MemberListItem key={member.user_id} profile={member} />
            ),
            onPress: () => {
              setModalUser(member);
              handleOpenBottomSheet();
            }
          }))}
        />
        <ButtonListBase
          heading={`(${offlineMembers.length}) Offline`}
          items={offlineMembers.map((member) => ({
            itemComponent: (
              <MemberListItem key={member.user_id} profile={member} />
            ),
            onPress: () => {
              setModalUser(member);
              handleOpenBottomSheet();
            }
          }))}
        />
      </ScrollView>
    </View>
  );
};

export default ServerMembers;

const styles = StyleSheet.create({
  item: {
    width: '100%',
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center'
  },
  userInfo: {
    gap: 4
  },
  username: {
    fontSize: 12,
    fontFamily: fonts.bold,
    lineHeight: 16,
    color: colors.black
  },
  status: {
    fontSize: 10,
    fontFamily: fonts.regular,
    lineHeight: 14,
    color: colors.gray02
  },
  bottomSheetContainer: {
    gap: 16,
    width: '100%'
  },
  rolesContainer: {
    width: '100%',
    gap: 4
  },
  roles: {
    gap: 8,
    paddingHorizontal: 8,
    flexDirection: 'row'
  },
  rolesText: {
    fontSize: 14,
    fontFamily: fonts.bold,
    color: colors.black,
    marginLeft: 8
  },
  roleItem: {
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    alignItems: 'center',
    backgroundColor: colors.gray04,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.gray02
  },
  roleDot: {
    width: 8,
    height: 8,
    borderRadius: 4
  },
  roleTitle: {
    fontSize: 12,
    fontFamily: fonts.regular,
    color: colors.black
  }
});
