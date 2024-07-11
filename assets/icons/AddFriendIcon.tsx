import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import Svg, { ClipPath, Defs, G, Path, Rect } from 'react-native-svg';
import { IconProps } from '@/types';
import { colors } from '@/constants/theme';

export default function AddFriendIcon({ color = colors.gray01 }: IconProps) {
  return (
    <View style={{ aspectRatio: 1 }}>
      <Svg viewBox="0 0 18 12" fill="none">
        <Path
          d="M11.25 6C12.9075 6 14.25 4.6575 14.25 3C14.25 1.3425 12.9075 0 11.25 0C9.5925 0 8.25 1.3425 8.25 3C8.25 4.6575 9.5925 6 11.25 6ZM4.5 4.5V3C4.5 2.5875 4.1625 2.25 3.75 2.25C3.3375 2.25 3 2.5875 3 3V4.5H1.5C1.0875 4.5 0.75 4.8375 0.75 5.25C0.75 5.6625 1.0875 6 1.5 6H3V7.5C3 7.9125 3.3375 8.25 3.75 8.25C4.1625 8.25 4.5 7.9125 4.5 7.5V6H6C6.4125 6 6.75 5.6625 6.75 5.25C6.75 4.8375 6.4125 4.5 6 4.5H4.5ZM11.25 7.5C9.2475 7.5 5.25 8.505 5.25 10.5V11.25C5.25 11.6625 5.5875 12 6 12H16.5C16.9125 12 17.25 11.6625 17.25 11.25V10.5C17.25 8.505 13.2525 7.5 11.25 7.5Z"
          fill={color}
        />
      </Svg>
    </View>
  );
}
