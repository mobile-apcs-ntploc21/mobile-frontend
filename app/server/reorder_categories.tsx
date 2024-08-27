import {
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View
} from 'react-native';
import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useState
} from 'react';
import { router, useNavigation } from 'expo-router';
import { NativeStackHeaderProps } from '@react-navigation/native-stack';

import MyText from '@/components/MyText';
import MyHeader from '@/components/MyHeader';
import useServers from '@/hooks/useServers';
import ReorderList from '@/components/reordering/ReorderList';
import { colors, fonts } from '@/constants/theme';
import MyAlert from '@/utils/alert';
import MyHeaderRight from '@/components/MyHeaderRight';

const ReorderCategories = () => {
  const navigation = useNavigation();
  const { categories, setCategories } = useServers();

  const [positions, setPositions] = useState<string[]>([]);

  const handleSave = useCallback(() => {
    // save new positions
    const newCategories = positions.map((id) =>
      categories.find((category) => category.id === id)
    );
    newCategories.unshift(categories[0]);
    // @ts-ignore
    setCategories(newCategories);
    router.canGoBack() && router.back();
  }, [categories, positions]);

  useEffect(() => {
    setPositions(categories.slice(1).map((category) => category.id));
  }, [categories]);

  useLayoutEffect(() => {
    navigation.setOptions({
      header: (props: NativeStackHeaderProps) => (
        <MyHeaderRight
          {...props}
          headingText="Reorder Categories"
          headingRightText="Save"
          onRightPress={handleSave}
        />
      )
    });
  }, [handleSave]);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <ReorderList
        items={positions.map((id) => ({
          text: categories.find((category) => category.id === id)?.name || '',
          onPressUp: () => {
            const index = positions.indexOf(id);
            if (index > 0) {
              const newPositions = [...positions];
              newPositions[index] = positions[index - 1];
              newPositions[index - 1] = id;
              setPositions(newPositions);
            }
          },
          onPressDown: () => {
            const index = positions.indexOf(id);
            if (index < positions.length - 1) {
              const newPositions = [...positions];
              newPositions[index] = positions[index + 1];
              newPositions[index + 1] = id;
              setPositions(newPositions);
            }
          }
        }))}
      />
    </ScrollView>
  );
};

export default ReorderCategories;

const styles = StyleSheet.create({
  container: {
    padding: 16
  }
});
