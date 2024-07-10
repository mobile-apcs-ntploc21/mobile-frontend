import { Pressable, StyleSheet, Text, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { rH, rW } from '@/styles/reponsive';
import { colors } from '@/constants/theme';
import MyText from './MyText';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming
} from 'react-native-reanimated';

interface ChildProps {
  isSelected: boolean;
}

interface ToggleProps {
  FirstFC: React.FC<ChildProps>;
  SecondFC: React.FC<ChildProps>;
  backgroundColor?: string;
  sliderColor?: string;
}

/**
 * Toggle component with two fields
 * @param props ToggleProps
 * @returns React.FC
 */
const Toggle = ({
  FirstFC,
  SecondFC,
  backgroundColor,
  sliderColor
}: ToggleProps) => {
  const [state, setState] = useState(false);

  const progress = useSharedValue(0);

  const rS = useAnimatedStyle(() => ({
    left: `${progress.value * 50}%`
  }));

  useEffect(() => {
    progress.value = state ? 0 : 1;
    progress.value = withTiming(state ? 1 : 0);
  }, [state]);

  return (
    <Pressable
      onPress={() => setState(!state)}
      style={[styles.container, backgroundColor ? { backgroundColor } : {}]}
    >
      <View style={styles.content}>
        <View style={styles.field}>
          <FirstFC isSelected={state} />
        </View>
        <View style={styles.field}>
          <SecondFC isSelected={!state} />
        </View>
        <Animated.View
          style={[
            styles.slider,
            sliderColor ? { backgroundColor: sliderColor } : {},
            rS
          ]}
        />
      </View>
    </Pressable>
  );
};

export default Toggle;

const styles = StyleSheet.create({
  container: {
    width: rW(301),
    height: rH(37),
    backgroundColor: colors.primary,
    borderRadius: 999,
    padding: 2
  },
  content: {
    flex: 1,
    flexDirection: 'row'
  },
  field: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  slider: {
    width: '50%',
    height: '100%',
    position: 'absolute',
    backgroundColor: colors.white,
    left: '50%',
    borderRadius: 999,
    zIndex: -1
  }
});
