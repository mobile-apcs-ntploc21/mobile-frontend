import { StyleSheet, Text, View } from 'react-native';
import { fonts } from '@/constants/theme';

export default function Servers() {
  return (
    <View>
      <Text
        style={{
          fontFamily: fonts.black
        }}
      >
        Tab Servers
      </Text>
    </View>
  );
}
