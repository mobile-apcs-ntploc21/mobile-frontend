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
// const onSubmit = () => showAlert('Subscribed to premium');

const PaymentFailed = () => {
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

  return <View style={GlobalStyles.screen}>
      <View style={styles.container}>
        <MyText style={[TextStyles.h2, { flex: 1, textAlign: 'center', fontWeight: 'bold' }]}>
            Payment Failed
        </MyText>
      </View>

      <View style={styles.content}>
        <View style={[styles.circle, { backgroundColor: colors.semantic_red }]}>
          <View style={{ aspectRatio: 1, margin: 16 }}>
            <CrossIcon color={colors.white} strokeWidth = {2} />
          </View>
        </View>
        <MyText style={[TextStyles.h1, { textAlign: 'center', color: colors.semantic_red, fontWeight: 'bold' }]}>
            Payment failed. Please try again.
        </MyText>
      </View>

      
      <View style={ styles.buttonContainer }>
        <MyButtonText
          title="Go Back"
          onPress= { goBack }
          containerStyle={styles.button}
        />
      </View>
  </View>;
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
        marginTop: 20,
        marginHorizontal: 64,
        paddingBottom: 64,
        alignItems: 'center',
        justifyContent: 'center'
    },
    row: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginVertical: 8,
        marginHorizontal: 24,
    },
    divider: {
        height: 2,
        backgroundColor: "black",
        marginVertical: 10,
        marginHorizontal: 24,
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
      width: 128, // Diameter of the circle
      height: 128,
      borderRadius: 64, // Half the width/height to make it circular
      alignItems: 'center', // Center the icon inside horizontally
      justifyContent: 'center', // Center the icon inside vertically
      margin: 32
    },
    
});

export default PaymentFailed;