import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import Svg, { ClipPath, Defs, G, Path, Rect } from 'react-native-svg';
import { IconProps } from '@/types';
import { colors } from '@/constants/theme';

export default function MicIcon({ color = colors.gray01 }: IconProps) {
  return (
    <View style={{ aspectRatio: 1 }}>
      <Svg viewBox="0 0 32 32" fill="none">
        <Path
          d="M16 18.6667C18.2133 18.6667 20 16.88 20 14.6667V6.66666C20 4.45332 18.2133 2.66666 16 2.66666C13.7867 2.66666 12 4.45332 12 6.66666V14.6667C12 16.88 13.7867 18.6667 16 18.6667ZM23.88 14.6667C23.2267 14.6667 22.68 15.1467 22.5733 15.8C22.0267 18.9333 19.2933 21.3333 16 21.3333C12.7067 21.3333 9.97334 18.9333 9.42667 15.8C9.32 15.1467 8.77334 14.6667 8.12 14.6667C7.30667 14.6667 6.66667 15.3867 6.78667 16.1867C7.44 20.1867 10.64 23.32 14.6667 23.8933V26.6667C14.6667 27.4 15.2667 28 16 28C16.7333 28 17.3333 27.4 17.3333 26.6667V23.8933C21.36 23.32 24.56 20.1867 25.2133 16.1867C25.3467 15.3867 24.6933 14.6667 23.88 14.6667Z"
          fill={color}
        />
      </Svg>
    </View>
  );
}
