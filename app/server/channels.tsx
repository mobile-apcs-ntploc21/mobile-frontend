import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import React, { useLayoutEffect, useMemo } from 'react';
import { router, useNavigation } from 'expo-router';
import { NativeStackHeaderProps } from '@react-navigation/native-stack';

import MyHeader from '@/components/MyHeader';
import { ScrollView } from 'react-native-gesture-handler';
import GlobalStyles from '@/styles/GlobalStyles';
import ButtonListText from '@/components/ButtonList/ButtonListText';
import useServers from '@/hooks/useServers';

const Settings = () => {
  const navigation = useNavigation();
  const { categories } = useServers();
  console.log(JSON.stringify(categories));

  useLayoutEffect(() => {
    navigation.setOptions({
      header: (props: NativeStackHeaderProps) => (
        <MyHeader {...props} title="Channels" />
      )
    });
  }, []);

  return (
    <FlatList
      data={categories}
      keyExtractor={(item) => item.id}
      renderItem={({ item: { name, channels } }) => (
        <ButtonListText
          heading={name}
          items={channels.map(({ name }) => ({ text: name }))}
        />
      )}
      ListFooterComponent={<View style={{ height: 16 }} />}
      contentContainerStyle={{ gap: 16 }}
      style={styles.container}
    />
  );
};

export default Settings;

const styles = StyleSheet.create({
  container: {
    ...GlobalStyles.container,
    flex: 1,
    paddingVertical: 16
  }
});
