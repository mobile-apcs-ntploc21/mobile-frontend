import {
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  View
} from 'react-native';
import React, { useMemo } from 'react';
import { Premium } from '@/types/premium';
import { colors, fonts } from '@/constants/theme';
import MyText from './MyText';
import { TextStyles } from '@/styles/TextStyles';
import { formatNumberWithCommas } from '@/utils/formatNumber';
import TickIcon from '@/assets/icons/TickIcon';

interface PremiumBoxProps {
  premium: Premium;
  isSelected: boolean;
}

const PremiumBox = (props: PremiumBoxProps) => {
  const textStyle = useMemo<TextStyle>(
    () => ({
      color: props.isSelected ? colors.black : colors.white
    }),
    [props.isSelected]
  );
  return (
    <View
      style={{
        flex: 1,
        borderColor: colors.white,
        borderWidth: 2,
        borderRadius: 8,
        padding: 8,
        backgroundColor: props.isSelected ? colors.white : 'transparent'
      }}
    >
      <MyText style={[TextStyles.bodyM, textStyle]}>
        {props.premium.duration}
      </MyText>
      <MyText style={[TextStyles.h5, textStyle]}>
        {formatNumberWithCommas(props.premium.price)}
      </MyText>
      <View style={{ flexDirection: 'row', gap: 4, alignItems: 'center' }}>
        <MyText style={[TextStyles.h5, textStyle]}>
          {props.premium.currency}
        </MyText>
        {props.premium.discount && (
          <View
            style={{
              backgroundColor: props.isSelected ? colors.black : colors.white,
              borderRadius: 10,
              justifyContent: 'center',
              paddingHorizontal: 4,
              height: 11
            }}
          >
            <MyText
              style={{
                fontFamily: fonts.black,
                fontSize: 8,
                color: props.isSelected ? colors.white : colors.black
              }}
            >
              -{Math.trunc(props.premium.discount * 100)}%
            </MyText>
          </View>
        )}
      </View>
      {props.isSelected && (
        <View
          style={{
            position: 'absolute',
            top: 2,
            right: 2,
            width: 14,
            height: 14,
            borderRadius: 7,
            padding: 3,
            backgroundColor: colors.black
          }}
        >
          <TickIcon color={colors.white} />
        </View>
      )}
    </View>
  );
};

export default PremiumBox;
