import {
  getOrder,
  getPosition,
  HEIGHT,
  MARGIN_X,
  MARGIN_Y,
  WIDTH
} from '@/utils/dragging';
import { ReactNode, useRef } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  SharedValue,
  useAnimatedReaction,
  useAnimatedStyle,
  useSharedValue,
  withTiming
} from 'react-native-reanimated';

interface DraggableProps {
  id: number;
  positions: SharedValue<number[]>;
  children: ReactNode;
}

const TIME = 250;

const Draggable = ({ id, positions, children }: DraggableProps) => {
  const scale = useSharedValue(1);
  const curPos = useSharedValue({ x: 0, y: 0 });
  const prePos = useSharedValue({ x: 0, y: 0 });
  const isGestureActive = useSharedValue(false);
  const isLongPressed = useSharedValue(false);
  const firstMount = useRef(true);

  useAnimatedReaction(
    () => positions.value[id],
    (newOrder) => {
      const newPos = getPosition(newOrder);
      //   console.log(`id: ${id}, reaction: ${newPos.x}, ${newPos.y}`);
      if (isGestureActive.value) return;
      if (firstMount.current) {
        curPos.value = prePos.value = {
          x: newPos.x,
          y: newPos.y
        };
        firstMount.current = false;
      } else
        curPos.value = prePos.value = withTiming(
          {
            x: newPos.x,
            y: newPos.y
          },
          { duration: TIME }
        );
    }
  );

  const longPress = Gesture.LongPress().onStart(() => {
    // console.log(`long press ${id}`);
    isLongPressed.value = true;
  });

  const pan = Gesture.Pan()
    .enabled(id > 0)
    .minDistance(1)
    .manualActivation(true)
    .onTouchesMove((_, mng) => {
      // console.log(`moving ${isLongPressed.value}`);
      if (isLongPressed.value) {
        mng.activate();
        // console.log('activated');
      } else mng.fail();
    })
    .onStart(() => {
      isGestureActive.value = true;
      scale.value = withTiming(1.1, { duration: TIME });
      prePos.value = { ...curPos.value };
    })
    .onUpdate((event) => {
      curPos.value = {
        x: prePos.value.x + event.translationX,
        y: prePos.value.y + event.translationY
      };

      const oldOrder = positions.value[id];
      const newOrder = getOrder(curPos.value.x, curPos.value.y);

      if (oldOrder !== newOrder) {
        const idToSwap = positions.value.findIndex((pos) => pos === newOrder);
        // console.log(
        //   `oldOrder: ${oldOrder}, newOrder: ${newOrder}, id: ${id}, idToSwap: ${idToSwap}`
        // );
        if (idToSwap > 0) {
          const newPositions = [...positions.value];
          newPositions[id] = newOrder;
          newPositions[idToSwap] = oldOrder;
          positions.value = newPositions;
        }
      }
    })
    .onTouchesUp(() => {
      const newPos = getPosition(positions.value[id]);
      //   console.log(`id: ${id}, newPos: ${newPos.x}, ${newPos.y}`);
      curPos.value = prePos.value = withTiming(
        {
          x: newPos.x,
          y: newPos.y
        },
        { duration: TIME }
      );

      scale.value = withTiming(1);
      isGestureActive.value = false;
      isLongPressed.value = false;
    });

  const animatedStyle = useAnimatedStyle(() => ({
    position: 'absolute',
    zIndex: isGestureActive.value ? 100 : 0,
    marginHorizontal: MARGIN_X,
    marginVertical: MARGIN_Y,
    transform: [
      { scale: scale.value },
      { translateX: curPos.value.x },
      { translateY: curPos.value.y }
    ]
  }));

  return (
    <GestureDetector gesture={Gesture.Simultaneous(longPress, pan)}>
      <Animated.View style={animatedStyle}>{children}</Animated.View>
    </GestureDetector>
  );
};

export default Draggable;
