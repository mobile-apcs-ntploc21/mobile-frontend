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
      <Link href="/emoji">Emoji (Touch me)</Link>
      <Link href="/members">Members (Touch me)</Link>
      <Link href="/bans">Bans (Touch me)</Link>
    </View>
  );
}
