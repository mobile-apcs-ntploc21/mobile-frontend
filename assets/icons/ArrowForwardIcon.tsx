import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import Svg, { ClipPath, Defs, G, Path, Rect } from 'react-native-svg';
import { IconProps } from '@/types';
import { colors } from '@/constants/theme';

export default function ArrowForwardIcon({ color = colors.gray01 }: IconProps) {
  return (
    <View style={{ aspectRatio: 1 }}>
      <Svg viewBox="0 0 32 32" fill="none">
        <Path
          d="M19.3 16L9.49998 6.20001C9.16665 5.86668 9.00554 5.47223 9.01665 5.01668C9.02776 4.56112 9.19998 4.16668 9.53332 3.83334C9.86665 3.50001 10.2611 3.33334 10.7167 3.33334C11.1722 3.33334 11.5667 3.50001 11.9 3.83334L22.1333 14.1C22.4 14.3667 22.6 14.6667 22.7333 15C22.8667 15.3333 22.9333 15.6667 22.9333 16C22.9333 16.3333 22.8667 16.6667 22.7333 17C22.6 17.3333 22.4 17.6333 22.1333 17.9L11.8667 28.1667C11.5333 28.5 11.1444 28.6611 10.7 28.65C10.2555 28.6389 9.86665 28.4667 9.53332 28.1333C9.19998 27.8 9.03332 27.4056 9.03332 26.95C9.03332 26.4945 9.19998 26.1 9.53332 25.7667L19.3 16Z"
          fill={color}
        />
      </Svg>
    </View>
  );
}
