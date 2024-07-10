import { Pressable, StyleSheet, Text, View, ViewProps } from 'react-native';
import React, { useEffect, useState } from 'react';
import { colors } from '@/constants/theme';
import { rH, rMS, rW } from '@/styles/reponsive';
import { TextStyles } from '@/styles/TextStyles';
import Entypo from '@expo/vector-icons/Entypo';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming
} from 'react-native-reanimated';

/**
 * Accordion component with collapsible content
 * @param props ViewProps
 * @returns React.FC
 */
const Accordion = (props: ViewProps) => {
  const [flag, setFlag] = useState(false);

  const { children, ...restProps } = props;
  const combinedStyles = StyleSheet.flatten([styles.container, props.style]);

  const progress = useSharedValue(0);
  const rS = useAnimatedStyle(() => {
    return {
      transform: [{ rotate: `${Math.PI * progress.value}rad` }]
    };
  });

  useEffect(() => {
    progress.value = flag ? 0 : 1;
    progress.value = withTiming(flag ? 1 : 0);
  }, [flag]);

  return (
    <View {...props} style={combinedStyles}>
      <Pressable style={styles.heading} onPress={() => setFlag(!flag)}>
        <Animated.View style={rS}>
          <Entypo name="chevron-up" size={24} color={colors.black} />
        </Animated.View>
        <Text style={TextStyles.h5}>Heading</Text>
      </Pressable>
      {flag && <View style={styles.content}>{children}</View>}
    </View>
  );
};

export default Accordion;

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    borderRadius: rMS(21),
    paddingHorizontal: rH(16),
    paddingVertical: rW(10)
  },
  heading: {
    flexDirection: 'row',
    columnGap: rW(10),
    alignItems: 'center'
  },
  content: {
    marginTop: rH(14)
  }
});
