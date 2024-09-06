import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import Svg, { Circle, ClipPath, Defs, G, Path, Rect } from 'react-native-svg';
import { IconProps } from '@/types';
import { colors } from '@/constants/theme';

export default function PlusIcon({ color = colors.gray01 }: IconProps) {
  return (
    <View style={{ aspectRatio: 1 }}>
      <Svg viewBox="0 0 32 32" fill="none">
        <G clipPath="url(#clip0_132_236)">
          <Path
            d="M16 2.66666C8.64002 2.66666 2.66669 8.63999 2.66669 16C2.66669 23.36 8.64002 29.3333 16 29.3333C23.36 29.3333 29.3334 23.36 29.3334 16C29.3334 8.63999 23.36 2.66666 16 2.66666ZM21.3334 17.3333H17.3334V21.3333C17.3334 22.0667 16.7334 22.6667 16 22.6667C15.2667 22.6667 14.6667 22.0667 14.6667 21.3333V17.3333H10.6667C9.93335 17.3333 9.33335 16.7333 9.33335 16C9.33335 15.2667 9.93335 14.6667 10.6667 14.6667H14.6667V10.6667C14.6667 9.93332 15.2667 9.33332 16 9.33332C16.7334 9.33332 17.3334 9.93332 17.3334 10.6667V14.6667H21.3334C22.0667 14.6667 22.6667 15.2667 22.6667 16C22.6667 16.7333 22.0667 17.3333 21.3334 17.3333Z"
            fill={color}
          />
        </G>
        <Defs>
          <ClipPath id="clip0_132_236">
            <Rect width="32" height="32" fill="white" />
          </ClipPath>
        </Defs>
      </Svg>
    </View>
  );
}
