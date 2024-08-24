import { Pressable, StyleSheet, Text, View } from 'react-native';
import React, { useEffect, useState } from 'react';
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
  value?: boolean;
  onChange?: (value: boolean) => void;
}

const Toggle = ({
  FirstFC,
  SecondFC,
  backgroundColor,
  sliderColor,
  value,
  onChange
}: ToggleProps) => {
  // Internal state is used only if value is not provided
  const [internalState, setInternalState] = useState(false);

  // Determine if the component is controlled
  const isControlled = value !== undefined;
  const state = isControlled ? value : internalState;

  const progress = useSharedValue(0);

  const rS = useAnimatedStyle(() => ({
    left: `${progress.value * 50}%`
  }));

  useEffect(() => {
    progress.value = withTiming(state ? 1 : 0);
  }, [state]);

  const handlePress = () => {
    const newState = !state;
    if (isControlled && onChange) {
      // If controlled, invoke onChange
      onChange(newState);
    } else {
      // If uncontrolled, update internal state
      setInternalState(newState);
    }
  };

  return (
    <Pressable
      onPress={handlePress}
      style={[styles.container, backgroundColor ? { backgroundColor } : {}]}
    >
      <View style={styles.content}>
        <View style={styles.field}>
          <FirstFC isSelected={!state} />
        </View>
        <View style={styles.field}>
          <SecondFC isSelected={state} />
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
    width: 301,
    height: 37,
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
