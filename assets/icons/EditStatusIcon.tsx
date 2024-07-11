import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import Svg, { Circle, ClipPath, Defs, G, Path, Rect } from 'react-native-svg';
import { IconProps } from '@/types';
import { colors } from '@/constants/theme';

export default function EditStatusIcon({ color = '#FDFDFD' }: IconProps) {
  return (
    <View style={{ aspectRatio: 1 }}>
      <Svg viewBox="0 0 25 25" fill="none">
        <G clipPath="url(#clip0_379_398)">
          <Path
            d="M12.4911 2.08337C6.74105 2.08337 2.0848 6.75004 2.0848 12.5C2.0848 18.25 6.74105 22.9167 12.4911 22.9167C18.2515 22.9167 22.9181 18.25 22.9181 12.5C22.9181 6.75004 18.2515 2.08337 12.4911 2.08337ZM8.85563 8.33337C9.72022 8.33337 10.4181 9.03129 10.4181 9.89587C10.4181 10.7605 9.72022 11.4584 8.85563 11.4584C7.99105 11.4584 7.29313 10.7605 7.29313 9.89587C7.29313 9.03129 7.99105 8.33337 8.85563 8.33337ZM17.4077 15.3334C16.4598 17.3646 14.6265 18.75 12.5015 18.75C10.3765 18.75 8.54313 17.3646 7.59522 15.3334C7.42855 14.9896 7.67855 14.5834 8.06397 14.5834H16.939C17.3244 14.5834 17.5744 14.9896 17.4077 15.3334ZM16.1473 11.4584C15.2827 11.4584 14.5848 10.7605 14.5848 9.89587C14.5848 9.03129 15.2827 8.33337 16.1473 8.33337C17.0119 8.33337 17.7098 9.03129 17.7098 9.89587C17.7098 10.7605 17.0119 11.4584 16.1473 11.4584Z"
            fill={color}
          />
        </G>
        <Defs>
          <ClipPath id="clip0_379_398">
            <Rect
              width="25"
              height="25"
              fill={color}
              transform="translate(0.00146484)"
            />
          </ClipPath>
        </Defs>
      </Svg>
    </View>
  );
}
