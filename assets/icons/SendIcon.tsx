import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import Svg, { Circle, ClipPath, Defs, G, Path, Rect } from 'react-native-svg';
import { IconProps } from '@/types';
import { colors } from '@/constants/theme';

export default function SendIcon({ color = colors.gray01 }: IconProps) {
  return (
    <View style={{ aspectRatio: 1 }}>
      <Svg viewBox="0 0 32 32" fill="none">
        <G clipPath="url(#clip0_1326_1647)">
          <Path
            d="M4.53335 27.2L27.8 17.2267C28.88 16.76 28.88 15.24 27.8 14.7733L4.53335 4.8C3.65335 4.41334 2.68002 5.06667 2.68002 6.01334L2.66669 12.16C2.66669 12.8267 3.16002 13.4 3.82669 13.48L22.6667 16L3.82669 18.5067C3.16002 18.6 2.66669 19.1733 2.66669 19.84L2.68002 25.9867C2.68002 26.9333 3.65335 27.5867 4.53335 27.2Z"
            fill="#F47521"
          />
        </G>
        <Defs>
          <ClipPath id="clip0_1326_1647">
            <Rect width="32" height="32" fill="white" />
          </ClipPath>
        </Defs>
      </Svg>
    </View>
  );
}
