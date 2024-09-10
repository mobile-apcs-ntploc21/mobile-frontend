import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import Svg, { Circle, ClipPath, Defs, G, Path, Rect } from 'react-native-svg';
import { IconProps } from '@/types';
import { colors } from '@/constants/theme';

export default function InfoIcon({ color = colors.primary }: IconProps) {
  return (
    <View style={{ aspectRatio: 1 }}>
      <Svg viewBox="0 0 36 36" fill="none">
        <G clipPath="url(#clip0_1790_667)">
          <Path
            d="M18 3C9.72 3 3 9.72 3 18C3 26.28 9.72 33 18 33C26.28 33 33 26.28 33 18C33 9.72 26.28 3 18 3ZM18 25.5C17.175 25.5 16.5 24.825 16.5 24V18C16.5 17.175 17.175 16.5 18 16.5C18.825 16.5 19.5 17.175 19.5 18V24C19.5 24.825 18.825 25.5 18 25.5ZM19.5 12C19.5 12.8284 18.8284 13.5 18 13.5C17.1716 13.5 16.5 12.8284 16.5 12C16.5 11.1716 17.1716 10.5 18 10.5C18.8284 10.5 19.5 11.1716 19.5 12Z"
            fill={color}
          />
        </G>
        <Defs>
          <ClipPath id="clip0_1790_667">
            <Rect width="36" height="36" fill="white" />
          </ClipPath>
        </Defs>
      </Svg>
    </View>
  );
}
