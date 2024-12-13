import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import Svg, { ClipPath, Defs, G, Path, Rect } from 'react-native-svg';
import { IconProps } from '@/types';
import { colors } from '@/constants/theme';

export default function DownloadIcon({ color = colors.gray01 }: IconProps) {
  return (
    <View style={{ aspectRatio: 1 }}>
      <Svg viewBox="0 0 32 32" fill="none">
        <Path
          d="M16 21.3333L9.33337 14.6666L11.2 12.7333L14.6667 16.2V5.33331H17.3334V16.2L20.8 12.7333L22.6667 14.6666L16 21.3333ZM8.00004 26.6666C7.26671 26.6666 6.63893 26.4055 6.11671 25.8833C5.59449 25.3611 5.33337 24.7333 5.33337 24V20H8.00004V24H24V20H26.6667V24C26.6667 24.7333 26.4056 25.3611 25.8834 25.8833C25.3612 26.4055 24.7334 26.6666 24 26.6666H8.00004Z"
          fill={color}
        />
      </Svg>
    </View>
  );
}
