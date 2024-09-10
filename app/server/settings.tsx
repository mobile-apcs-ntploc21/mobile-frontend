import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { useLayoutEffect, useMemo } from 'react';
import { router, useNavigation } from 'expo-router';
import { NativeStackHeaderProps } from '@react-navigation/native-stack';

import MyHeader from '@/components/MyHeader';
import { ScrollView } from 'react-native-gesture-handler';
import GlobalStyles from '@/styles/GlobalStyles';
import ButtonListText from '@/components/ButtonList/ButtonListText';

const Settings = () => {
  const navigation = useNavigation();

  const generalActions = useMemo(
    () => [
      {
        text: 'Overview',
        onPress: () => router.navigate('./overview')
      },
      {
        text: 'Channels',
        onPress: () => router.navigate('./channels')
      },
      {
        text: 'Emoji',
        onPress: () => router.navigate('./emoji')
      },
      {
        text: 'Invite code',
        onPress: () => {}
      }
    ],
    []
  );

  const memberActions = useMemo(
    () => [
      {
        text: 'Members',
        onPress: () => router.navigate('./members')
      },
      {
        text: 'Roles',
        onPress: () => router.navigate('./roles')
      },
      {
        text: 'Bans',
        onPress: () => router.navigate('./bans')
      }
    ],
    []
  );

  useLayoutEffect(() => {
    navigation.setOptions({
      header: (props: NativeStackHeaderProps) => (
        <MyHeader {...props} title="Server Settings" />
      )
    });
  }, []);

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ gap: 16 }}>
      <ButtonListText heading="General" items={generalActions} />
      <ButtonListText heading="Member Management" items={memberActions} />
    </ScrollView>
  );
};

export default Settings;

const styles = StyleSheet.create({
  container: {
    ...GlobalStyles.container,
    paddingTop: 16
  }
});
