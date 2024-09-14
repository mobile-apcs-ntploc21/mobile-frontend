import { NativeStackHeaderProps } from '@react-navigation/native-stack';
import { router, useNavigation } from 'expo-router';
import { useCallback, useEffect, useLayoutEffect, useState } from 'react';
import { ScrollView, StyleSheet } from 'react-native';

import MyHeaderRight from '@/components/MyHeaderRight';
import ReorderList from '@/components/reordering/ReorderList';
import { ServerActions } from '@/context/ServerProvider';
import useServer from '@/hooks/useServer';
import { patchData } from '@/utils/api';
import { showAlert, useNotification } from '@/services/alert';

const ReorderChannels = () => {
  const { showAlert } = useNotification();
  const navigation = useNavigation();
  const { server_id, categories, dispatch } = useServer();

  const [currentCat, setCurrentCat] = useState<typeof categories>(categories);

  const handleSave = useCallback(async () => {
    // Create a new array contains list of channels
    type Channel = {
      channel_id: string;
      category_id: string | null;
      position: number;
    };
    const channels: Channel[] = [];
    currentCat.forEach((category) => {
      category.channels.forEach((channel, index) => {
        channels.push({
          channel_id: channel.id,
          category_id: category.id,
          position: index
        });
      });
    });

    // Post a request to the server to update the channels order
    try {
      const requestBody = {
        server_id,
        channels
      };
      const response = await patchData(
        `/api/v1/servers/${server_id}/channels/move`,
        requestBody
      );

      if (!response) {
        throw new Error('Failed to update channels order.');
      }

      // Update the server with the new channels order
      dispatch({ type: ServerActions.SET_CATEGORIES, payload: currentCat });
      router.canGoBack() && router.back();
    } catch (e: any) {
      showAlert('Failed to update channels order.');
      console.error(e.message);
    }
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
