import { StyleSheet, Text, View } from 'react-native';
import React, { useLayoutEffect } from 'react';
import { Stack, useNavigation } from 'expo-router';

const Layout = () => {
  const navigation = useNavigation();
  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false
    });
  }, []);
  return <Stack />;
};

export default Layout;

const styles = StyleSheet.create({});
