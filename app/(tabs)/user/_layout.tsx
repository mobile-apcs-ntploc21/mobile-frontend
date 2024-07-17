import { View, Text } from 'react-native';
import React, { useEffect } from 'react';
import { router, Stack, useNavigation } from 'expo-router';
import { colors } from '@/constants/theme';
import MyHeader from '@/components/MyHeader';
import { useFormik } from 'formik';

const StackLayout = () => {
  const navigation = useNavigation();

  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
    </Stack>
  );
};

export default StackLayout;
