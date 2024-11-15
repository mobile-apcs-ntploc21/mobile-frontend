import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import React, {
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState
} from 'react';
import { router, useLocalSearchParams, useNavigation } from 'expo-router';
import { NativeStackHeaderProps } from '@react-navigation/native-stack';
import MyHeader from '@/components/MyHeader';
import { colors } from '@/constants/theme';
import ButtonListText from '@/components/ButtonList/ButtonListText';
import ButtonListBase from '@/components/ButtonList/ButtonListBase';
import MemberItem from '@/components/userManagment/MemberItem';
import useServers from '@/hooks/useServers';
import { ScrollView } from 'react-native-gesture-handler';
import RoleIcon from '@/assets/icons/RoleIcon';
import { TextStyles } from '@/styles/TextStyles';
import RoleItem from '@/components/userManagment/RoleItem';
import useServer from '@/hooks/useServer';
import { useGlobalContext } from '@/context/GlobalProvider';
import { useAuth } from '@/context/AuthProvider';
import { useSubscription } from '@apollo/client';
import { SERVER_SUBSCRIPTION } from '@/services/graphql/subscriptions';
import { ServerEvents } from '@/types';
import { Member, Role } from '@/types/server';
import { deleteData, getData, postData } from '@/utils/api';
import BasicModal from '@/components/modal/BasicModal';
import MyBottomSheetModal from '@/components/modal/MyBottomSheetModal';
import { BottomSheetModal } from '@gorhom/bottom-sheet';

const Permissions = () => {
  const navigation = useNavigation();
  const { setCallback } = useGlobalContext();
  const { categoryId: category_id } = useLocalSearchParams<{
    categoryId: string;
  }>();

  const { members, roles, server_id } = useServer();
  const { user } = useAuth();

  const { data: subscriptionData } = useSubscription(SERVER_SUBSCRIPTION, {
    variables: { server_id: server_id, user_id: user?.id }
  });

  const [permissionUserIds, setPermissionUserIds] = useState<string[]>([]);
  const permissionUsers = useMemo(() => {
    return permissionUserIds
      .map((id) => members.find((member) => member.user_id === id))
      .filter((members) => members !== undefined);
  }, [permissionUserIds, members]);
  const [permissionRoleIds, setPermissionRoleIds] = useState<string[]>([]);
  const permissionRoles = useMemo(() => {
    return permissionRoleIds
      .map((id) => roles.find((role) => role.id === id))
      .filter((roles) => roles !== undefined);
  }, [permissionRoleIds, roles]);

  useLayoutEffect(() => {
    navigation.setOptions({
      header: (props: NativeStackHeaderProps) => (
        <MyHeader {...props} title="Category Permissions" />
      )
    });
  }, []);

  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchData = async () => {
      const userResponse = await getData(
        `/api/v1/servers/${server_id}/categories/${category_id}/users/permissions`
      );
      const roleResponse = await getData(
        `/api/v1/servers/${server_id}/categories/${category_id}/roles/permissions`
      );
      setPermissionUserIds(userResponse.users.map((user: any) => user.id));
      setPermissionRoleIds(roleResponse.roles.map((role: any) => role.id));
      setLoading(false);
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (!subscriptionData) return;
    const { serverUpdated: serverData } = subscriptionData;
    const { type, server_id: data_server_id, data } = serverData;
    if (data_server_id !== server_id) return;
    const data_category_id = data?._id?.category_id;
    if (data_category_id !== category_id) return;

    switch (type) {
      case ServerEvents.categoryUserAdded:
        setPermissionUserIds((prev) => [...prev, data._id.user_id]);
        break;
      case ServerEvents.categoryUserDeleted:
        setPermissionUserIds((prev) =>
          prev.filter((id) => id !== data._id.user_id)
        );
        break;
      case ServerEvents.categoryRoleAdded:
        setPermissionRoleIds((prev) => [...prev, data._id.server_role_id]);
        break;
      case ServerEvents.categoryRoleDeleted:
        setPermissionRoleIds((prev) =>
          prev.filter((id) => id !== data._id.server_role_id)
        );
        break;
    }
  }, [subscriptionData]);

  const bottomSheetRef = useRef<BottomSheetModal>(null);
  const handleOpenBottomSheet = () => {
    bottomSheetRef.current?.present();
  };

  const handleCloseBottomSheet = () => {
    bottomSheetRef.current?.dismiss();
  };

  const [modalData, setModalData] = useState<{
    type: 'user' | 'role';
    id: string;
  } | null>(null);

  const getModalTitle = (type: 'user' | 'role') => {
    if (type === 'user') {
      const user = members.find((member) => member.user_id === modalData?.id);
      return user?.display_name || user?.username || 'User';
    }
    if (type === 'role') {
      const role = roles.find((role) => role.id === modalData?.id);
      return role?.name || 'Role';
    }
  };

  if (loading) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.gray04 }}>
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.gray04 }}>
      <MyBottomSheetModal
        ref={bottomSheetRef}
        heading={modalData ? getModalTitle(modalData.type) : ''}
        onClose={() => handleCloseBottomSheet()}
      >
        <ButtonListText
          items={[
            {
              text: 'Edit permissions',
              onPress: () => {
                // navigate to edit permissions page
                router.navigate({
                  pathname: '/server/edit_permissions',
                  params: {
                    user_role_type: modalData?.type,
                    user_role_id: modalData?.id,
                    categories_channels_type: 'categories',
                    categories_channels_id: category_id
                  }
                });
                handleCloseBottomSheet();
              }
            },
            {
              text: 'Remove',
              onPress: () => {
                if (modalData?.type === 'user') {
                  // remove user from the category
                  deleteData(
                    `/api/v1/servers/${server_id}/categories/${category_id}/users/${modalData.id}/permissions`
                  );
                } else if (modalData?.type === 'role') {
                  // remove role from the category
                  deleteData(
                    `/api/v1/servers/${server_id}/categories/${category_id}/roles/${modalData.id}/permissions`
                  );
                }
                handleCloseBottomSheet();
              },
              style: {
                color: colors.semantic_red
              },
              // hide the remove button if the role is default
              isHidden:
                modalData?.type === 'role' &&
                roles.find((role) => role.id === modalData?.id)?.default
            }
          ]}
        />
      </MyBottomSheetModal>
      <ScrollView contentContainerStyle={styles.container}>
        <ButtonListText
          items={[
            {
              text: 'Add members',
              onPress: () => {
                setCallback(() => (memberIds: string[]) => {
                  // add members to the server
                  memberIds.forEach((memberId) => {
                    postData(
                      `/api/v1/servers/${server_id}/categories/${category_id}/users/${memberId}/permissions`
                    );
                  });
                });
                router.navigate({
                  pathname: '/server/add_members',
                  params: {
                    excluded: permissionUserIds
                  }
                });
              }
            },
            {
              text: 'Add roles',
              onPress: () => {
                setCallback(() => (roleIds: string[]) => {
                  // add roles to the server
                  roleIds.forEach((roleId) => {
                    postData(
                      `/api/v1/servers/${server_id}/categories/${category_id}/roles/${roleId}/permissions`
                    );
                  });
                });
                router.navigate({
                  pathname: '/server/add_roles',
                  params: {
                    excluded: permissionRoleIds
                  }
                });
              }
            }
          ]}
        />
        {/* Mocking data, use the whole members and roles of server for mocking */}
        {permissionUsers.length > 0 && (
          <ButtonListBase
            heading="Members"
            items={permissionUsers.map((member) => ({
              itemComponent: <MemberItem profile={member} />,
              onPress: () => {
                setModalData({ type: 'user', id: member.user_id });
                handleOpenBottomSheet();
              }
            }))}
          />
        )}
        {permissionRoles.length > 0 && (
          <ButtonListBase
            heading="Roles"
            items={permissionRoles.map((role, index) => ({
              itemComponent: <RoleItem role={role} key={index} />,
              onPress: () => {
                setModalData({ type: 'role', id: role.id });
                handleOpenBottomSheet();
              }
            }))}
          />
        )}
      </ScrollView>
    </View>
  );
};

export default Permissions;

const styles = StyleSheet.create({
  container: {
    padding: 16,
    gap: 16
  },
  roleItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16
  },
  roleIcon: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 40,
    height: 40
  },
  iconWrapper: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0
  },
  memberCount: {
    ...TextStyles.bodyS,
    color: colors.black
  },
  roleTitle: {
    ...TextStyles.bodyXL,
    color: colors.black
  }
});
