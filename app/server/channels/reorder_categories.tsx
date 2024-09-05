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

import ReorderList from '@/components/reordering/ReorderList';
import MyHeaderRight from '@/components/MyHeaderRight';
import useServer from '@/hooks/useServer';
import { ServerActions } from '@/context/ServerProvider';

const ReorderCategories = () => {
  const navigation = useNavigation();
  const { categories, dispatch } = useServer();

  const [currentCat, setCurrentCat] = useState<typeof categories>(
    categories.slice(1)
  );

  const handleSave = useCallback(() => {
    currentCat.unshift(categories[0]);
    dispatch({ type: ServerActions.SET_CATEGORIES, payload: currentCat });
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
