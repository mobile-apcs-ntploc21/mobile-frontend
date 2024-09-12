import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { useEffect, useLayoutEffect, useMemo, useState } from 'react';
import { router, useNavigation } from 'expo-router';
import MyHeader from '@/components/MyHeader';
import MyText from '@/components/MyText';
import { TextStyles } from '@/styles/TextStyles';
import { colors } from '@/constants/theme';
import { NativeStackHeaderProps } from '@react-navigation/native-stack';
import GlobalStyles from '@/styles/GlobalStyles';
import ButtonListText from '@/components/ButtonList/ButtonListText';
import SearchBar from '@/components/SearchBar';
import { ScrollView } from 'react-native-gesture-handler';
import ButtonListBase from '@/components/ButtonList/ButtonListBase';
import IconWithSize from '@/components/IconWithSize';
import RoleIcon from '@/assets/icons/RoleIcon';
import RoleItem from '@/components/userManagment/RoleItem';
import useServers from '@/hooks/useServers';
import { frequencyMatch } from '@/utils/search';
import { getData } from '@/utils/api';
import useServer from '@/hooks/useServer';
import { ServerActions } from '@/context/ServerProvider';

const Roles = () => {
  const { currentServerId } = useServers();
  const { customRoles: roles, dispatch } = useServer();
  const navigation = useNavigation();
  useLayoutEffect(() => {
    navigation.setOptions({
      header: (props: NativeStackHeaderProps) => (
        <MyHeader
          {...props}
          title="Roles"
          headerRight={
            <TouchableOpacity onPress={() => router.navigate('./add-role')}>
              <MyText style={styles.headerAdd}>Add</MyText>
            </TouchableOpacity>
          }
        />
      )
    });
  }, []);

  // useEffect(() => {
  //   (async () => {
  //     try {
  //       const response = await getData(
  //         `/api/v1/servers/${currentServerId}/roles`
  //       );
  //       // console.log(response);
  //       // console.log(responseToRoles(response));
  //       dispatch({
  //         type: ServerActions.SET_ROLES,
  //         payload: responseToRoles(response)
  //       });
  //     } catch (e: any) {
  //       console.error(e.message);
  //     }
  //   })();
  // }, []);

  const [searchText, setSearchText] = useState('');

  const filteredRoles = useMemo(() => {
    return roles.filter((role) => frequencyMatch(role.name, searchText));
  }, [roles, searchText]);

  return (
    <View style={{ flex: 1, backgroundColor: colors.gray04 }}>
      <View style={styles.headerContainer}>
        <ButtonListText
          items={[
            {
              text: 'Default Permissions',
              onPress: async () => {
                const response = await getData(
                  `/api/v1/servers/${currentServerId}/roles`
                );
                const defaultRoleId = response.roles.find(
                  (role: any) => role.default === true
                ).id;
                console.log(defaultRoleId);
                if (defaultRoleId) {
                  router.navigate(`./default/permissions`);
                }
              }
            }
          ]}
        />
        <SearchBar value={searchText} onChangeText={setSearchText} />
      </View>
      <ScrollView contentContainerStyle={styles.scrollView}>
        <ButtonListBase
          heading={`(${filteredRoles.length}) Roles`}
          items={filteredRoles.map((role, index) => ({
            itemComponent: <RoleItem role={role} />,
            onPress: () =>
              router.navigate({
                pathname: `./${role.id}`,
                params: {
                  roleTitle: role.name
                }
              })
          }))}
        />
      </ScrollView>
    </View>
  );
};

export default Roles;

const styles = StyleSheet.create({
  headerAdd: {
    ...TextStyles.h3,
    color: colors.primary
  },
  headerContainer: {
    padding: 16,
    gap: 16
  },
  scrollView: {
    paddingHorizontal: 16,
    paddingBottom: 16
  }
});
