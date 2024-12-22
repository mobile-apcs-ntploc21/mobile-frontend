import { View, Text, TouchableOpacity, FlatList } from 'react-native';
import React, { useCallback, useLayoutEffect, useMemo, useState } from 'react';
import { useNavigation } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '@/constants/theme';
import { Entypo } from '@expo/vector-icons';
import { useNotification } from '@/services/alert';
import MyText from '@/components/MyText';
import { TextStyles } from '@/styles/TextStyles';
import { Premium } from '@/types/premium';
import { samplePremiums } from '@/constants/premium';
import PremiumBox from '@/components/PremiumBox';
import TickIcon from '@/assets/icons/TickIcon';
import { MyButtonText } from '@/components/MyButton';

const PremiumDashboard = () => {
  const navigation = useNavigation();
  const { showAlert } = useNotification();
  const [premiums, setPremiums] = useState<Premium[]>(samplePremiums);
  const [selectedPremium, setSelectedPremium] = useState<Premium>(premiums[0]);

  const onSubmit = () => showAlert('Subscribed to premium');

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
      <View
        style={{
          marginTop: 48,
          flexDirection: 'row',
          gap: 16,
          height: 88,
          paddingHorizontal: 16,
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        {premiums.map((premium, index) => (
          <TouchableOpacity
            style={{ flex: 1 }}
            key={index}
            onPress={() => setSelectedPremium(premium)}
          >
            <PremiumBox
              key={index}
              premium={premium}
              isSelected={premium === selectedPremium}
            />
          </TouchableOpacity>
        ))}
      </View>
      <FlatList
        data={selectedPremium.features}
        keyExtractor={(item) => item}
        renderItem={({ item }) => (
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
            <View style={{ width: 16, height: 16 }}>
              <TickIcon color={colors.white} />
            </View>
            <MyText style={[TextStyles.h3, { color: colors.white }]}>
              {item}
            </MyText>
          </View>
        )}
        style={{ marginTop: 32 }}
        contentContainerStyle={{ gap: 8 }}
      />
      <MyButtonText
        title="Subscribe Now"
        style={{ marginTop: 32 }}
        textStyle={{ color: colors.white }}
        containerStyle={{ width: '100%', backgroundColor: colors.black }}
        onPress={onSubmit}
      />
    </LinearGradient>
  );
};

export default PremiumDashboard;
