import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import Svg, { ClipPath, Defs, G, Path, Rect } from 'react-native-svg';
import { IconProps } from '@/types';

export default function MessageIcon({ color = '#FDFDFD' }: IconProps) {
  return (
    <View style={{ aspectRatio: 1 }}>
      <Svg viewBox="0 0 25 25" fill="none">
        <G clip-path="url(#clip0_154_379)">
          <Path
            d="M12.5 20.8333L11.6042 19.9375C10.375 18.7083 10.3854 16.7083 11.625 15.5L12.5 14.6458C12.0938 14.6041 11.7917 14.5833 11.4583 14.5833C8.67708 14.5833 3.125 15.9791 3.125 18.75V20.8333H12.5ZM11.4583 12.5C13.7604 12.5 15.625 10.6354 15.625 8.33329C15.625 6.03121 13.7604 4.16663 11.4583 4.16663C9.15625 4.16663 7.29167 6.03121 7.29167 8.33329C7.29167 10.6354 9.15625 12.5 11.4583 12.5Z"
            fill={color}
          />
          <Path
            d="M16.8542 20.6042C16.4479 21.0104 15.7813 21.0104 15.375 20.6042L13.2187 18.4271C12.8229 18.0208 12.8229 17.375 13.2187 16.9792L13.2292 16.9688C13.6354 16.5625 14.2917 16.5625 14.6875 16.9688L16.1146 18.3958L20.7292 13.75C21.1354 13.3438 21.7917 13.3438 22.1979 13.75L22.2083 13.7604C22.6042 14.1667 22.6042 14.8125 22.2083 15.2083L16.8542 20.6042Z"
            fill={color}
          />
        </G>
        <Defs>
          <ClipPath id="clip0_154_379">
            <Rect width="25" height="25" fill={color} />
          </ClipPath>
        </Defs>
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({});
