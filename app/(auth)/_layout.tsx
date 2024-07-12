import { View, Text } from 'react-native';
import React, { useEffect } from 'react';
import { Stack, useNavigation } from 'expo-router';
import { colors } from '@/constants/theme';
import { Chevron } from '@/constants/images';

const StackLayout = () => {
  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, []);

  return (
    <Stack
      screenOptions={{
        headerTitle: '',
        headerBackImageSource: Chevron,
        headerTransparent: true
      }}
    ></Stack>
  );
};

export default StackLayout;
