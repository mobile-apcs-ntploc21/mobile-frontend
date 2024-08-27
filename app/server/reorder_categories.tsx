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

  const [currentCat, setCurrentCat] = useState<typeof categories>(
    categories.slice(1)
  );

  const handleSave = useCallback(() => {
    currentCat.unshift(categories[0]);
    setCategories(currentCat);
    router.canGoBack() && router.back();
  }, [currentCat]);

  useEffect(() => {
    setCurrentCat(categories.slice(1));
  }, [categories]);

  useLayoutEffect(() => {
    navigation.setOptions({
      header: (props: NativeStackHeaderProps) => (
        <MyHeaderRight
          {...props}
          headingText="Reorder Categories"
          headingRightText="Save"
          onRightPress={handleSave}
          showAlert
        />
      )
    });
  }, [handleSave]);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <ReorderList
        items={currentCat.map((category, index) => ({
          text: category.name,
          onPressUp: () => {
            const newCat = [...currentCat];
            if (index === 0) return;
            newCat.splice(index, 1);
            newCat.splice(index - 1, 0, category);
            setCurrentCat(newCat);
          },
          onPressDown: () => {
            const newCat = [...currentCat];
            if (index === currentCat.length - 1) return;
            newCat.splice(index, 1);
            newCat.splice(index + 1, 0, category);
            setCurrentCat(newCat);
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
