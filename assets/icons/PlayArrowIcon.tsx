import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import Svg, { ClipPath, Defs, G, Path, Rect } from 'react-native-svg';
import { IconProps } from '@/types';
import { colors } from '@/constants/theme';

export default function PlayArrowIcon({ color = colors.gray01 }: IconProps) {
  return (
    <View style={{ aspectRatio: 1 }}>
      <Svg viewBox="0 0 24 24" fill="none">
        <Path
          d="M8 17.175V6.82501C8 6.54168 8.1 6.30418 8.3 6.11251C8.5 5.92085 8.73333 5.82501 9 5.82501C9.08333 5.82501 9.17083 5.83751 9.2625 5.86251C9.35417 5.88751 9.44167 5.92501 9.525 5.97501L17.675 11.15C17.825 11.25 17.9375 11.375 18.0125 11.525C18.0875 11.675 18.125 11.8333 18.125 12C18.125 12.1667 18.0875 12.325 18.0125 12.475C17.9375 12.625 17.825 12.75 17.675 12.85L9.525 18.025C9.44167 18.075 9.35417 18.1125 9.2625 18.1375C9.17083 18.1625 9.08333 18.175 9 18.175C8.73333 18.175 8.5 18.0792 8.3 17.8875C8.1 17.6958 8 17.4583 8 17.175Z"
          fill={color}
        />
      </Svg>
    </View>
  );
}