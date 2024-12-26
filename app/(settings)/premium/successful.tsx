import { View, Text, TouchableOpacity, FlatList } from 'react-native';
import React, { useCallback, useLayoutEffect, useMemo, useState } from 'react';
import { router, useLocalSearchParams, useNavigation } from 'expo-router';
import { NativeStackHeaderProps } from '@react-navigation/native-stack';
import MyHeader from '@/components/MyHeader';
import { colors } from '@/constants/theme';
import { Entypo } from '@expo/vector-icons';
import { useNotification } from '@/services/alert';
import MyText from '@/components/MyText';
import { TextStyles } from '@/styles/TextStyles';
import { Premium } from '@/types/premium';
import { samplePremiums } from '@/constants/premium';
import GlobalStyles from '@/styles/GlobalStyles';
import { StyleSheet } from 'react-native';
import Svg, { ClipPath, Defs, Path, Rect } from 'react-native-svg';
import { IconProps } from '@/types';

import { MyButtonText } from '@/components/MyButton';
import { G } from 'react-native-svg';
import CrossIcon from '@/assets/icons/CrossIcon';
import TickIcon from '@/assets/icons/TickIcon';
// const onSubmit = () => showAlert('Subscribed to premium');

const PaymentFailed = () => {
  const navigation = useNavigation();
  const { showAlert } = useNotification();

  const params = useLocalSearchParams();

  const [_, packageId, orderId] = useMemo(() => {
    return (params.vnp_OrderInfo as string).split(',');
  }, [params]);

  const selectedPremium: Premium | undefined = useMemo(() => {
    return samplePremiums.find((item) => item.id === packageId);
  }, [packageId]);

  if (!selectedPremium) {
    showAlert('Something is wrong');
    return null;
  }

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
    <View style={GlobalStyles.screen}>
      <View style={styles.container}>
        <MyText
          style={[
            TextStyles.h2,
            { flex: 1, textAlign: 'center', fontWeight: 'bold' }
          ]}
        >
          Payment Successful
        </MyText>
      </View>

      <View style={styles.content}>
        <View
          style={[
            styles.circle,
            {
              backgroundColor: colors.white,
              borderWidth: 4,
              borderColor: colors.semantic_green,
              alignSelf: 'center'
            }
          ]}
        >
          <View style={{ aspectRatio: 1, padding: 14, paddingTop: 16 }}>
            <TickIcon color={colors.semantic_green} strokeWidth={2} />
          </View>
        </View>
        <MyText
          style={[
            TextStyles.h3,
            {
              textAlign: 'center',
              color: colors.semantic_green,
              fontWeight: 'bold'
            }
          ]}
        >
          Thank you for your payment!
        </MyText>
        <View
          style={[
            styles.infoContainer,
            { borderWidth: 1, borderColor: colors.gray03, borderRadius: 8 }
          ]}
        >
          <View style={styles.row}>
            <MyText style={[TextStyles.bodyXL]}>Order ID</MyText>
            <MyText style={[TextStyles.h5, { fontWeight: 'bold' }]}>
              {orderId}
            </MyText>
          </View>
          <View style={styles.row}>
            <MyText style={[TextStyles.bodyXL]}>Description</MyText>
            <MyText
              style={[
                TextStyles.h5,
                {
                  fontWeight: 'bold',
                  textAlign: 'right',
                  flexWrap: 'wrap',
                  width: '50%'
                }
              ]}
            >
              Premium Subscription for {selectedPremium.duration}
            </MyText>
          </View>
          <View style={styles.row}>
            <MyText style={[TextStyles.bodyXL]}>Amount Paid</MyText>
            <MyText style={[TextStyles.h5, { fontWeight: 'bold' }]}>
              {selectedPremium.price.toLocaleString() +
                ' ' +
                selectedPremium.currency}
            </MyText>
          </View>
          <View style={styles.row}>
            <MyText style={[TextStyles.bodyXL]}>Date & Time</MyText>
            <MyText style={[TextStyles.h5, { fontWeight: 'bold' }]}>
              {new Date().toLocaleString()}
            </MyText>
          </View>
        </View>
      </View>

      <View style={styles.buttonContainer}>
        <MyButtonText
          title="Go Back"
          onPress={() => router.navigate('/settings')}
          containerStyle={styles.button}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    gap: 16,
    backgroundColor: colors.white,
    height: 72,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray03
  },
  content: {
    flex: 1,
    marginBottom: 20,
    marginHorizontal: 16,
    paddingBottom: 64
    // alignItems: 'center',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 8,
    marginHorizontal: 16
  },
  buttonContainer: {
    padding: 16
  },
  button: {
    alignSelf: 'center',
    color: colors.primary,
    width: '100%'
  },
  circle: {
    width: 72, // Diameter of the circle
    height: 72,
    borderRadius: 36, // Half the width/height to make it circular
    alignItems: 'center', // Center the icon inside horizontally
    justifyContent: 'center', // Center the icon inside vertically
    margin: 16
  },
  infoContainer: {
    justifyContent: 'space-between',
    marginVertical: 32
  }
});

export default PaymentFailed;
