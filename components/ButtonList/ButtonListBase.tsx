import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React from 'react';
import { TextStyles } from '@/styles/TextStyles';
import MyText from '../MyText';
import { colors } from '@/constants/theme';

export interface ButtonListBaseProps {
  heading?: string;
  // itemComponents?: React.ReactNode[];
  items?: {
    itemComponent: React.ReactNode;
    onPress?: () => void;
  }[];
}

const ButtonListBase = (props: ButtonListBaseProps) => {
  return (
    <View style={styles.container}>
      {props.heading && <MyText style={styles.heading}>{props.heading}</MyText>}
      <View style={styles.itemContainer}>
        {props.items?.map((item, index) => (
          <View key={index}>
            <TouchableOpacity style={styles.item} onPress={item.onPress}>
              {item.itemComponent}
            </TouchableOpacity>
            {index < props.items!.length - 1 && (
              <View style={styles.separatorContainer}>
                <View style={styles.separator} />
              </View>
            )}
          </View>
        ))}
      </View>
    </View>
  );
};

export default ButtonListBase;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    gap: 4
  },
  heading: {
    ...TextStyles.h5,
    marginLeft: 24
  },
  itemContainer: {
    width: '100%',
    borderRadius: 20,
    overflow: 'hidden'
  },
  item: {
    width: '100%',
    paddingVertical: 12,
    paddingHorizontal: 16,
    justifyContent: 'center',
    backgroundColor: colors.white
  },
  separatorContainer: {
    paddingHorizontal: 16,
    backgroundColor: colors.white
  },
  separator: {
    borderBottomColor: colors.gray03,
    borderBottomWidth: 1,
    height: 0
  }
});
