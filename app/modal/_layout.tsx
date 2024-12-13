import React, { useEffect } from 'react';
import { Slot, useNavigation } from 'expo-router';

export default function ModalLayout() {
  const navigation = useNavigation();
  useEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, []);
  return <Slot />;
}
