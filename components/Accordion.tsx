import { Pressable, StyleSheet, Text, View, ViewProps } from 'react-native';
import React, { useState } from 'react';
import { colors } from '@/constants/theme';
import { rH, rMS, rW } from '@/styles/reponsive';
import { TextStyles } from '@/styles/TextStyles';
import Entypo from '@expo/vector-icons/Entypo';

/**
 * Accordion component with collapsible content
 * @param props ViewProps
 * @returns React.FC
 */
const Accordion = (props: ViewProps) => {
  const [flag, setFlag] = useState(false);

  const { children, ...restProps } = props;
  const combinedStyles = StyleSheet.flatten([styles.container, props.style]);

  return (
    <View {...props} style={combinedStyles}>
      <Pressable style={styles.heading} onPress={() => setFlag(!flag)}>
        <Entypo
          name={flag ? 'chevron-down' : 'chevron-up'}
          size={24}
          color={colors.black}
        />
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
