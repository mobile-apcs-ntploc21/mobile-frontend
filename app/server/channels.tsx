import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { useLayoutEffect, useMemo } from 'react';
import { useNavigation } from 'expo-router';
import { NativeStackHeaderProps } from '@react-navigation/native-stack';

import MyHeader from '@/components/MyHeader';
import { ScrollView } from 'react-native-gesture-handler';
import GlobalStyles from '@/styles/GlobalStyles';
import ButtonListText from '@/components/ButtonList/ButtonListText';

const Settings = () => {
  const navigation = useNavigation();

  const createActions = useMemo(
    () => [
      {
        text: 'Create categories',
        onPress: () => {}
      },
      {
        text: 'Create channels',
        onPress: () => {}
      }
    ],
    []
  );

  const editActions = useMemo(
    () => [
      {
        text: 'Edit categories',
        onPress: () => {}
      },
      {
        text: 'Edit channels',
        onPress: () => {}
      }
    ],
    []
  );

  useLayoutEffect(() => {
    navigation.setOptions({
      header: (props: NativeStackHeaderProps) => (
        <MyHeader {...props} title="Channels" />
      )
    });
  }, []);

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ gap: 16 }}>
      <ButtonListText heading="General" items={createActions} />
      <ButtonListText heading="Member Management" items={editActions} />
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
