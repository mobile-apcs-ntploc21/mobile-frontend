import { StyleSheet, Text, View } from 'react-native';
import React, { useLayoutEffect } from 'react';
import { Stack, useNavigation } from 'expo-router';
import { ServerProvider } from '@/context/ServerContext';

const Layout = () => {
  const navigation = useNavigation();
  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false
    });
  }, []);
  return (
    <ServerProvider>
      <Stack />
    </ServerProvider>
  );
};

export default Layout;

const styles = StyleSheet.create({});
