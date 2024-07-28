import { StyleSheet, Text, View } from 'react-native';
import { fonts } from '@/constants/theme';
import { Link } from 'expo-router';

export default function Servers() {
  return (
    <View>
      <Text
        style={{
          fontFamily: fonts.black
        }}
      >
        Tab Servers Hello
      </Text>
      <Link href="/servers/members">Members</Link>
    </View>
  );
}
