import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { useLayoutEffect } from 'react';
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

const Roles = () => {
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
  return (
    <View style={{ flex: 1, backgroundColor: colors.gray04 }}>
      <View style={styles.headerContainer}>
        <ButtonListText
          items={[
            {
              text: 'Default Permissions',
              onPress: () => {}
            }
          ]}
        />
        <SearchBar />
      </View>
      <ScrollView contentContainerStyle={styles.scrollView}>
        <ButtonListBase
          heading={`(10) Roles`}
          items={Array.from({ length: 10 }, (_, index) => ({
            itemComponent: (
              <RoleItem
                role={{
                  id: `role-${index}`,
                  name: `Role ${index + 1}`,
                  color: colors.primary
                }}
              />
            ),
            onPress: () =>
              router.navigate({
                pathname: `./${index}`,
                params: {
                  roleTitle: `Role ${index + 1}`
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
