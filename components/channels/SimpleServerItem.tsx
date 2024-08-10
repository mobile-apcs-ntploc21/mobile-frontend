import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useState } from 'react';
import { colors } from '@/constants/theme';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming
} from 'react-native-reanimated';
import { ServerItemProps } from '@/types';

interface SimpleServerItemProps extends ServerItemProps {
  id: string;
  selected?: boolean;
}

const SimpleServerItem = (props: SimpleServerItemProps) => {
  const [flag, setFlag] = useState(false);

  const isControlled = props.selected !== undefined;
  const state = isControlled ? props.selected : flag;

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
    props.onPress?.(props.id);
  };

  return (
    <Pressable onPress={handlePress}>
      <Animated.View style={[styles.container, animatedStyle]}>
        <View style={styles.serverImg} />
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
