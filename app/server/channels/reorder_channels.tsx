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

const ReorderChannels = () => {
  const navigation = useNavigation();
  const { categories, dispatch } = useServer();

  const [currentCat, setCurrentCat] = useState<typeof categories>(categories);

  const handleSave = useCallback(() => {
    dispatch({ type: ServerActions.SET_CATEGORIES, payload: currentCat });
    router.canGoBack() && router.back();
  }, [currentCat]);

  useEffect(() => {
    setCurrentCat(categories);
  }, [categories]);

  useLayoutEffect(() => {
    navigation.setOptions({
      header: (props: NativeStackHeaderProps) => (
        <MyHeaderRight
          {...props}
          headingText="Reorder Channels"
          headingRightText="Save"
          onRightPress={handleSave}
          showAlert
        />
      )
    });
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {currentCat.map((category, index) => (
        <ReorderList
          key={category.id}
          heading={category.name}
          items={category.channels.map((channel) => ({
            text: channel.name,
            onPressUp: () => {
              const newCat = [...currentCat];
              const newChannels = [...newCat[index].channels];
              const currentIndex = newChannels.indexOf(channel);
              const newIndex = currentIndex - 1;
              if (newIndex < 0) return;
              [newChannels[currentIndex], newChannels[newIndex]] = [
                newChannels[newIndex],
                newChannels[currentIndex]
              ];
              newCat[index].channels = newChannels;
              setCurrentCat(newCat);
            },
            onPressDown: () => {
              const newCat = [...currentCat];
              const newChannels = [...newCat[index].channels];
              const currentIndex = newChannels.indexOf(channel);
              const newIndex = currentIndex + 1;
              if (newIndex >= newChannels.length) return;
              [newChannels[currentIndex], newChannels[newIndex]] = [
                newChannels[newIndex],
                newChannels[currentIndex]
              ];
              newCat[index].channels = newChannels;
              setCurrentCat(newCat);
            }
          }))}
        />
      ))}
    </ScrollView>
  );
};

export default ReorderChannels;

const styles = StyleSheet.create({
  container: {
    padding: 16,
    gap: 16
  }
});
