import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import Svg, { ClipPath, Defs, G, Path, Rect } from 'react-native-svg';
import { IconProps } from '@/types';

export default function MessageIcon({ color = '#FDFDFD' }: IconProps) {
  return (
    <View style={{ aspectRatio: 1 }}>
      <Svg viewBox="0 0 25 25" fill="none">
        <G clip-path="url(#clip0_154_395)">
          <Path
            d="M20.8333 2.08337H4.16668C3.02084 2.08337 2.08334 3.02087 2.08334 4.16671V22.9167L6.25001 18.75H20.8333C21.9792 18.75 22.9167 17.8125 22.9167 16.6667V4.16671C22.9167 3.02087 21.9792 2.08337 20.8333 2.08337ZM9.37501 11.4584H7.29168V9.37504H9.37501V11.4584ZM13.5417 11.4584H11.4583V9.37504H13.5417V11.4584ZM17.7083 11.4584H15.625V9.37504H17.7083V11.4584Z"
            fill={color}
          />
        </G>
        <Defs>
          <ClipPath id="clip0_154_395">
            <Rect width="25" height="25" fill={color} />
          </ClipPath>
        </Defs>
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({});
