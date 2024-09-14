import { NativeStackHeaderProps } from '@react-navigation/native-stack';
import { router, useNavigation } from 'expo-router';
import { useCallback, useEffect, useLayoutEffect, useState } from 'react';
import { ScrollView, StyleSheet } from 'react-native';

import MyHeaderRight from '@/components/MyHeaderRight';
import ReorderList from '@/components/reordering/ReorderList';
import { ServerActions } from '@/context/ServerProvider';
import useServer from '@/hooks/useServer';
import { showAlert, useNotification } from '@/services/alert';
import { patchData } from '@/utils/api';

const ReorderCategories = () => {
  const { showAlert } = useNotification();
  const navigation = useNavigation();
  const { server_id, categories, dispatch } = useServer();

  const [currentCat, setCurrentCat] = useState<typeof categories>(
    categories.slice(1)
  );

  const handleSave = useCallback(async () => {
    // Post a request to the server to update the categories order
    type Category = {
      category_id: string | null;
      position: number;
    };
    const _categories: Category[] = currentCat.map((category, index) => ({
      category_id: category.id,
      position: index
    }));

    // Request to the server to update the categories order
    try {
      const requestBody = {
        server_id,
        categories: _categories
      };

      const response = await patchData(
        `/api/v1/servers/${server_id}/categories/move`,
        requestBody
      );

      if (!response) {
        throw new Error('Failed to update categories order.');
      }

      // Update the server with the new categories order
      currentCat.unshift(categories[0]);
      dispatch({ type: ServerActions.SET_CATEGORIES, payload: currentCat });
      router.canGoBack() && router.back();
    } catch (e: any) {
      showAlert('Failed to update categories order.');
      console.error(e.message);
    }
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
