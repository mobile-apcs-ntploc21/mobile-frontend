import { Link } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

export default function DM() {
  return (
    <View>
      <Text>Tab DM</Text>
      <Link href="/dm/friends">Go to Friends</Link>
    </View>
  );
}
