import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle
} from 'react-native';
import React from 'react';
import { TextStyles } from '@/styles/TextStyles';
import MyText from '../MyText';
import { colors } from '@/constants/theme';
import { ScrollView } from 'react-native-gesture-handler';

export interface ButtonListBaseProps {
  heading?: string;
  items?: {
    itemComponent: React.ReactNode;
    onPress?: () => void;
  }[];
  scrollable?: boolean;
}

const ButtonListBase = (props: ButtonListBaseProps) => {
  const itemList = (
    <>
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
    </>
  );
  return (
    <View style={[styles.container, props.scrollable ? { flex: 1 } : {}]}>
      {props.heading && <MyText style={styles.heading}>{props.heading}</MyText>}
      {props.scrollable ? (
        <ScrollView contentContainerStyle={styles.itemContainer}>
          {itemList}
        </ScrollView>
      ) : (
        <View style={styles.itemContainer}>{itemList}</View>
      )}
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
