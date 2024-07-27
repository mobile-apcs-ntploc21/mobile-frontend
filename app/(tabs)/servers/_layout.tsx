import { View, Text } from 'react-native';
import React from 'react';
import { Stack } from 'expo-router';

const StackLayout = () => {
  return (
    <Stack
      screenOptions={{
        headerShown: false
      }}
    ></Stack>
  );
};

export default StackLayout;
