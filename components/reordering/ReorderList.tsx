import { StyleSheet, Text, View } from 'react-native';
import React, { FC } from 'react';
import MyText from '../MyText';
import { colors, fonts } from '@/constants/theme';
import ReorderItem, { ReorderItemProps } from './ReorderItem';

interface ReorderListProps {
  heading?: string;
  items: ReorderItemProps[];
}

const ReorderList = (props: ReorderListProps) => {
  return (
    <View>
      {props.heading && <MyText style={styles.heading}>{props.heading}</MyText>}
      <View style={styles.list}>
        {props.items.map((item, index) => (
          <View key={item.text}>
            <View style={styles.item}>
              <ReorderItem {...item} />
            </View>
            {index < props.items.length - 1 && (
              <View style={styles.seperator} />
            )}
          </View>
        ))}
      </View>
    </View>
  );
};

export default ReorderList;

const styles = StyleSheet.create({
  heading: {
    fontSize: 14,
    fontFamily: fonts.bold,
    marginBottom: 4,
    marginLeft: 24
  },
  list: {
    paddingHorizontal: 16,
    borderRadius: 21,
    backgroundColor: colors.white
  },
  item: {
    paddingVertical: 12
  },
  seperator: {
    height: 1,
    width: '100%',
    backgroundColor: colors.gray03
  }
});
