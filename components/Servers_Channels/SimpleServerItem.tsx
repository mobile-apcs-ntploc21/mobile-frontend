import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Image } from 'expo-image';
import { useMemo, useState } from 'react';
import { colors } from '@/constants/theme';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming
} from 'react-native-reanimated';
import { ServerItemProps } from '@/types';
import useServers from '@/hooks/useServers';

interface SimpleServerItemProps extends ServerItemProps {
  id: string;
  selected?: boolean;
}

const SimpleServerItem = ({
  id,
  selected,
  onPress = (id) => console.log(id)
}: SimpleServerItemProps) => {
  const placeholderImg = 'https://via.placeholder.com/150';
  const { serverMap } = useServers();
  const [flag, setFlag] = useState(false);

  const isControlled = selected !== undefined;
  const state = isControlled ? selected : flag;
  const currentServer = useMemo(() => serverMap[id], [serverMap, id]);

  const animatedStyle = useAnimatedStyle(
    () => ({
      borderWidth: withTiming(state ? 3 : 0, { duration: 300 }) // Adjust duration as needed
    }),
    [state]
  );

  const handlePress = () => {
    if (!isControlled) {
      setFlag(!flag);
    }
    onPress(id);
  };

  return (
    <Pressable onPress={handlePress}>
      <Animated.View style={[styles.container, animatedStyle]}>
        <Image
          source={{
            uri: currentServer?.avatar ?? placeholderImg
          }}
          style={styles.serverImg}
        />
      </Animated.View>
    </Pressable>
  );
};

export default SimpleServerItem;

const styles = StyleSheet.create({
  container: {
    width: 52,
    height: 52,
    borderRadius: 26,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: colors.primary
  },
  serverImg: {
    width: 44,
    height: 44,
    borderRadius: 44 / 2,
    backgroundColor: colors.gray02
  }
});
