import { View, Text, TouchableOpacity } from 'react-native';
import React, { useCallback, useLayoutEffect } from 'react';
import { useNavigation } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '@/constants/theme';
import { Entypo } from '@expo/vector-icons';
import { useNotification } from '@/services/alert';
import MyText from '@/components/MyText';
import { TextStyles } from '@/styles/TextStyles';

const PremiumDashboard = () => {
  const navigation = useNavigation();
  const { showAlert } = useNotification();

  const goBack = useCallback(() => {
    if (navigation.canGoBack()) navigation.goBack();
    else showAlert('Cannot go back');
  }, [navigation]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false
    });
  }, []);

  return (
    <LinearGradient
      colors={[colors.primary, '#F69453', colors.white]}
      style={{ flex: 1, padding: 16 }}
    >
      <TouchableOpacity
        onPress={goBack}
        style={{
          paddingVertical: 8,
          alignSelf: 'flex-start'
        }}
      >
        <Entypo name="chevron-thin-left" size={32} color={colors.white} />
      </TouchableOpacity>
      <MyText
        style={[
          TextStyles.h2,
          { color: colors.white, alignSelf: 'center', marginTop: 16 }
        ]}
      >
        Subscribe to Premium
      </MyText>
    </LinearGradient>
  );
};

export default PremiumDashboard;
