import { StyleSheet, Text, View } from 'react-native';
import React, { useLayoutEffect } from 'react';
import { router, useNavigation } from 'expo-router';
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
import { Actions } from '@/context/ServersProvider';
import RoleItem from '@/components/userManagment/RoleItem';

const Permissions = () => {
  const navigation = useNavigation();
  const { members, roles, dispatch } = useServers();

  useLayoutEffect(() => {
    navigation.setOptions({
      header: (props: NativeStackHeaderProps) => (
        <MyHeader {...props} title="Category Permissions" />
      )
    });
  }, []);
  return (
    <View style={{ flex: 1, backgroundColor: colors.gray04 }}>
      <ScrollView contentContainerStyle={styles.container}>
        <ButtonListText
          items={[
            {
              text: 'Add members',
              onPress: () => {
                dispatch({
                  type: Actions.SET_CALLBACK,
                  payload: (memberIds: string[]) => {
                    // add members to the server
                    console.log('Adding members:', memberIds);
                  }
                });
                router.push('/server/add_members');
              }
            },
            {
              text: 'Add roles',
              onPress: () => {
                dispatch({
                  type: Actions.SET_CALLBACK,
                  payload: (roleIds: string[]) => {
                    // add roles to the server
                    console.log('Adding roles:', roleIds);
                  }
                });
                router.push('/server/add_roles');
              }
            }
          ]}
        />
        {members.length > 0 && (
          <ButtonListBase
            heading="Members"
            items={members.map((member) => ({
              itemComponent: <MemberItem member={member} />,
              onPress: () => {}
            }))}
          />
        )}
        {roles.length > 0 && (
          <ButtonListBase
            heading="Roles"
            items={roles.map((role, index) => ({
              itemComponent: <RoleItem role={role} key={index} />,
              onPress: () => {}
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
