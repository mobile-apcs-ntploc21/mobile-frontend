import { BackHandler, StyleSheet, Text, View } from 'react-native';
import React, { useEffect } from 'react';

interface EmojiPickerProps {
  visible: boolean;
  handleClose: () => void;
  height: number;
}

// This should not be mistaken for the ReactionPicker component
const EmojiPicker = (props: EmojiPickerProps) => {
  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      () => {
        if (props.visible) {
          props.handleClose();
          return true;
        }
        return false;
      }
    );
    return () => backHandler.remove();
  }, [props.visible]);

  if (!props.visible) return null;
  return (
    <View style={{ height: props.height }}>
      <Text>Emoji Picker</Text>
    </View>
  );
};

export default EmojiPicker;

const styles = StyleSheet.create({});
