import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { useLayoutEffect } from 'react';
import { useNavigation } from 'expo-router';
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

const Roles = () => {
  const navigation = useNavigation();
  useLayoutEffect(() => {
    navigation.setOptions({
      header: (props: NativeStackHeaderProps) => (
        <MyHeader
          {...props}
          title="Roles"
          headerRight={
            <TouchableOpacity onPress={() => {}}>
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
              <View style={styles.roleItem}>
                <View style={styles.roleIcon}>
                  <View style={styles.iconWrapper}>
                    <RoleIcon color={colors.primary} />
                  </View>
                  <Text style={styles.memberCount}>10</Text>
                </View>
                <Text style={styles.roleTitle}>Admin</Text>
              </View>
            ),
            onPress: () => {}
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
