import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  ActivityIndicator
} from 'react-native';
import React, { useCallback, useLayoutEffect, useMemo, useState } from 'react';
import { router, useLocalSearchParams, useNavigation } from 'expo-router';
import { NativeStackHeaderProps } from '@react-navigation/native-stack';
import MyHeader from '@/components/MyHeader';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '@/constants/theme';
import { Entypo } from '@expo/vector-icons';
import { useNotification } from '@/services/alert';
import MyText from '@/components/MyText';
import { TextStyles } from '@/styles/TextStyles';
import { Premium } from '@/types/premium';
import { samplePremiums } from '@/constants/premium';
import GlobalStyles from '@/styles/GlobalStyles';
import { StyleSheet } from 'react-native';
import PremiumBox from '@/components/PremiumBox';
import TickIcon from '@/assets/icons/TickIcon';
import { MyButtonText } from '@/components/MyButton';
import { G } from 'react-native-svg';
import { postData } from '@/utils/api';
import VnpayMerchant from '@/react-native-vnpay-merchant';
import config from '@/utils/config';

const PaymentConfirmation = () => {
  const navigation = useNavigation();
  const { showAlert } = useNotification();

  const { premiumId } = useLocalSearchParams<{
    premiumId?: string;
  }>();

  const goBack = useCallback(() => {
    if (navigation.canGoBack()) navigation.goBack();
    else showAlert('Cannot go back');
  }, [navigation]);

  const selectedPremium: Premium | undefined = useMemo(() => {
    return samplePremiums.find((item) => item.id === premiumId);
  }, [premiumId]);

  if (!selectedPremium) {
    showAlert('Premium not found');
    return null;
  }

  const [paymentUrl, setPaymentUrl] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState(true);

  useLayoutEffect(() => {
    if (!selectedPremium) {
      router.back();
    }
    (async () => {
      const response = await postData('/api/v1/payments/create-order', {
        packageId: selectedPremium.id,
        returnUrl: 'myapp://premium/pending'
      });

      if (!response.success) {
        showAlert('Failed to create order');
        router.back();
      }

      setPaymentUrl(response.data.paymentUrl);
      setLoading(false);
    })();
  }, []);

  const onSubmit = () => {
    VnpayMerchant.show({
      isSandbox: true,
      paymentUrl: paymentUrl,
      tmn_code: config.VNPAY_TMN_CODE,
      backAlert: 'Bạn có chắc chắn trở lại ko?',
      title: 'VNPAY',
      iconBackName: 'ic_close',
      beginColor: 'ffffff',
      endColor: 'ffffff',
      titleColor: '000000',
      scheme: 'myapp'
    });
  };

  const orderId = useMemo(() => {
    const urlParams = new URLSearchParams(paymentUrl);
    return urlParams.get('vnp_OrderInfo')?.split(',')[2];
  }, [paymentUrl]);

  const discountAmount = selectedPremium.originalPrice - selectedPremium.price;
  const discountedPrice = selectedPremium.price;

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false
    });
  }, []);

  if (loading) {
    return (
      <View style={GlobalStyles.screen}>
        <View style={styles.container}>
          <TouchableOpacity onPress={goBack}>
            <Entypo name="chevron-thin-left" size={32} color={colors.black} />
          </TouchableOpacity>
          <MyText style={[TextStyles.h2, { flex: 1, textAlign: 'center' }]}>
            Payment Confirmation
          </MyText>
          <View style={{ width: 32 }} />
        </View>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <View style={GlobalStyles.screen}>
      <View style={styles.container}>
        <TouchableOpacity onPress={goBack}>
          <Entypo name="chevron-thin-left" size={32} color={colors.black} />
        </TouchableOpacity>
        <MyText style={[TextStyles.h2, { flex: 1, textAlign: 'center' }]}>
          Payment Confirmation
        </MyText>
        <View style={{ width: 32 }} />
      </View>

      {/* Content */}
      <View style={styles.content}>
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
            {'Premium Subscription for ' + selectedPremium.duration}
          </MyText>
        </View>
        <View style={styles.row}>
          <MyText style={[TextStyles.bodyXL]}>Original Amount</MyText>
          <MyText style={[TextStyles.h5, { fontWeight: 'bold' }]}>
            {selectedPremium.originalPrice.toLocaleString()}{' '}
            {selectedPremium.currency}
          </MyText>
        </View>
        <View style={styles.row}>
          <MyText style={[TextStyles.bodyXL]}>Discount</MyText>
          <MyText style={[TextStyles.h5, { fontWeight: 'bold' }]}>
            {discountAmount > 0
              ? `-${discountAmount.toLocaleString()}`
              : discountAmount.toLocaleString()}{' '}
            {selectedPremium.currency}
          </MyText>
        </View>
        <View style={styles.divider} />
        <View style={styles.row}>
          <MyText style={[TextStyles.bodyXL]}>Final Amount</MyText>
          <MyText style={[TextStyles.h2, { fontWeight: 'bold' }]}>
            {discountedPrice.toLocaleString()} {selectedPremium.currency}
          </MyText>
        </View>
      </View>
      <View style={styles.buttonContainer}>
        <MyButtonText
          title="Continue"
          onPress={onSubmit}
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
    marginTop: 20
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 8,
    marginHorizontal: 24
  },
  divider: {
    height: 2,
    backgroundColor: 'black',
    marginVertical: 10,
    marginHorizontal: 24
  },
  buttonContainer: {
    padding: 16
  },
  button: {
    alignSelf: 'center',
    color: colors.primary,
    width: '100%'
  }
});

export default PaymentConfirmation;
