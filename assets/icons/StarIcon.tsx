import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import Svg, { ClipPath, Defs, G, Path, Rect } from 'react-native-svg';
import { IconProps } from '@/types';
import { colors } from '@/constants/theme';

export default function StarIcon({ color = colors.gray01 }: IconProps) {
  return (
    <View style={{ aspectRatio: 1 }}>
      <Svg viewBox="0 0 14 13" fill="none">
        <Path
          d="M12.7375 4.78L9.1075 4.465L7.69 1.1275C7.435 0.52 6.565 0.52 6.31 1.1275L4.8925 4.4725L1.27 4.78C0.610001 4.8325 0.340001 5.6575 0.842501 6.0925L3.595 8.4775L2.77 12.0175C2.62 12.6625 3.3175 13.1725 3.8875 12.8275L7 10.9525L10.1125 12.835C10.6825 13.18 11.38 12.67 11.23 12.025L10.405 8.4775L13.1575 6.0925C13.66 5.6575 13.3975 4.8325 12.7375 4.78ZM7 9.55L4.18 11.2525L4.93 8.0425L2.44 5.8825L5.725 5.5975L7 2.575L8.2825 5.605L11.5675 5.89L9.0775 8.05L9.8275 11.26L7 9.55Z"
          fill={color}
        />
      </Svg>
    </View>
  );
}
