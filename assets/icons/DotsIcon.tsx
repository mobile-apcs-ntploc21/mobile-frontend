import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import Svg, { Circle, ClipPath, Defs, G, Path, Rect } from 'react-native-svg';
import { IconProps } from '@/types';
import { colors } from '@/constants/theme';

export default function DotsIcon({ color = colors.gray01 }: IconProps) {
  return (
    <View style={{ aspectRatio: 1 }}>
      <Svg viewBox="0 0 37 9" fill="none">
        <Circle cx="18.5" cy="4.5" r="4.5" fill={color} />
        <Circle cx="32.5" cy="4.5" r="4.5" fill={color} />
        <Circle cx="4.5" cy="4.5" r="4.5" fill={color} />
      </Svg>
    </View>
  );
}
