import { View, Text, TouchableOpacity, FlatList } from 'react-native';
import React, { useCallback, useLayoutEffect, useMemo, useState } from 'react';
import { useLocalSearchParams, useNavigation } from 'expo-router';
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
// const onSubmit = () => showAlert('Subscribed to premium');


const PaymentConfirmation = () => {
    const navigation = useNavigation();
    const { showAlert } = useNotification();

    const goBack = useCallback(() => {
        if (navigation.canGoBack()) navigation.goBack();
        else showAlert('Cannot go back');
    }, [navigation]);

    const { premiumDuration } = useLocalSearchParams<{
        'premiumDuration': string;
    }>();

    const selectedPremium: Premium | undefined = useMemo(() => {
        return samplePremiums.find((item) => item.duration === premiumDuration);
    }, [premiumDuration]);
    
    
    useLayoutEffect(() => {
    navigation.setOptions({
        headerShown: false
    });
    }, []);

    return ({});
}

export default PaymentConfirmation;