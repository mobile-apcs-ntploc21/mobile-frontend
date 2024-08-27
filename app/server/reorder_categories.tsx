import {
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View
} from 'react-native';
import React, { useLayoutEffect, useState } from 'react';
import { router, useNavigation } from 'expo-router';
import { NativeStackHeaderProps } from '@react-navigation/native-stack';

import MyText from '@/components/MyText';
import MyHeader from '@/components/MyHeader';
import useServers from '@/hooks/useServers';
import ReorderList from '@/components/reordering/ReorderList';
import { colors, fonts } from '@/constants/theme';

const ReorderCategories = () => {
  const navigation = useNavigation();
  const { categories } = useServers();

  useLayoutEffect(() => {
    navigation.setOptions({
      header: (props: NativeStackHeaderProps) => (
        <MyHeader
          {...props}
          title="Reorder Categories"
          headerRight={
            <TouchableOpacity>
              <MyText style={styles.headingText}>Save</MyText>
            </TouchableOpacity>
          }
        />
      )
    });
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <ReorderList
        items={categories.slice(1).map((category) => ({
          text: category.name,
          onPressUp: () => console.log('up', category.name),
          onPressDown: () => console.log('down', category.name)
        }))}
      />
    </ScrollView>
  );
};

export default ReorderCategories;

const styles = StyleSheet.create({
  container: {
    padding: 16
  },
  headingText: {
    color: colors.primary,
    fontSize: 20,
    fontFamily: fonts.medium
  }
});
