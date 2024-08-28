import { ScrollView, StyleSheet, Text, View } from 'react-native';
import React, { FC, ReactNode, useMemo } from 'react';
import { colors, fonts } from '@/constants/theme';
import MyText from './MyText';

interface MyListProps {
  heading?: string;
  items: ReactNode[];
  scrollable?: boolean;
}

const MyList = (props: MyListProps) => {
  const renderItems = useMemo(
    () =>
      props.items.map((item, index) => (
        <React.Fragment key={index}>
          <View style={styles.item}>{item}</View>
          {index < props.items.length - 1 && <View style={styles.seperator} />}
        </React.Fragment>
      )),
    [props.items]
  );

  return (
    <View style={{ flex: 1 }}>
      {props.heading && <MyText style={styles.heading}>{props.heading}</MyText>}
      {props.scrollable ? (
        <ScrollView style={styles.list}>{renderItems}</ScrollView>
      ) : (
        <View style={styles.list}>{renderItems}</View>
      )}
    </View>
  );
};

export default MyList;

const styles = StyleSheet.create({
  heading: {
    fontSize: 14,
    fontFamily: fonts.bold,
    marginLeft: 24,
    marginBottom: 4
  },
  list: {
    flex: 1,
    paddingHorizontal: 16,
    borderRadius: 21,
    backgroundColor: colors.white
  },
  item: {
    paddingVertical: 12
  },
  seperator: {
    width: '100%',
    height: 1,
    backgroundColor: colors.gray03
  }
});
