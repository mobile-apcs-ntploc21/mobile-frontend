import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import Svg, { ClipPath, Defs, G, Path, Rect } from 'react-native-svg';
import { IconProps } from '@/types';
import { colors } from '@/constants/theme';

export default function EmojiIcon({ color = colors.gray01 }: IconProps) {
  return (
    <View style={{ aspectRatio: 1 }}>
      <Svg viewBox="0 0 24 24" fill="none">
        <Path
          d="M11.988 0C5.364 0 0 5.376 0 12C0 18.624 5.364 24 11.988 24C18.624 24 24 18.624 24 12C24 5.376 18.624 0 11.988 0ZM7.8 7.2C8.796 7.2 9.6 8.004 9.6 9C9.6 9.996 8.796 10.8 7.8 10.8C6.804 10.8 6 9.996 6 9C6 8.004 6.804 7.2 7.8 7.2ZM17.652 15.264C16.56 17.604 14.448 19.2 12 19.2C9.552 19.2 7.44 17.604 6.348 15.264C6.156 14.868 6.444 14.4 6.888 14.4H17.112C17.556 14.4 17.844 14.868 17.652 15.264ZM16.2 10.8C15.204 10.8 14.4 9.996 14.4 9C14.4 8.004 15.204 7.2 16.2 7.2C17.196 7.2 18 8.004 18 9C18 9.996 17.196 10.8 16.2 10.8Z"
          fill={color}
        />
      </Svg>
    </View>
  );
}
