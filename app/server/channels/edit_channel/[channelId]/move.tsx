import { StyleSheet, Text, View } from 'react-native';
import React, { useLayoutEffect } from 'react';
import { router, useLocalSearchParams, useNavigation } from 'expo-router';
import MyHeader from '@/components/MyHeader';
import { NativeStackHeaderProps } from '@react-navigation/native-stack';
import { colors } from '@/constants/theme';
import ButtonListText from '@/components/ButtonList/ButtonListText';
import useServer from '@/hooks/useServer';
import useServers from '@/hooks/useServers';
import { showAlert } from '@/services/alert';
import { patchData } from '@/utils/api';
import { ServerActions } from '@/context/ServerProvider';

const Move = () => {
  const navigation = useNavigation();
  const { currentServerId } = useServers();
  const { categories, dispatch } = useServer();
  const { channelId } = useLocalSearchParams<{
    channelId: string;
  }>();

  const handleMove = async (categoryId: string | null) => {
    try {
      const requestBody = {
        category_id: categoryId,
        new_position: 9999 // Move to the end of the list
      };
      const response = await patchData(
        `/api/v1/servers/${currentServerId}/channels/${channelId}/move`,
        requestBody
      );

      if (!response) {
        throw new Error('Failed to move channel to new category');
      }

      // Move the chanel to new categories and dispatch
      let channelToMove = null;
      const newCategories = [...categories];
      newCategories.forEach((category) => {
        const channelIndex = category.channels.findIndex(
          (channel) => channel.id === channelId
        );
        if (channelIndex !== -1) {
          channelToMove = category.channels.splice(channelIndex, 1)[0];
        }
      });

      if (channelToMove) {
        const targetCategory = newCategories.find(
          (category) => category.id === categoryId
        );
        if (targetCategory) {
          targetCategory.channels.push(channelToMove);
        }
      }
      dispatch({ type: ServerActions.UPDATE_CHANNEL, payload: newCategories });

      // Go back to the previous screen
      router.back();
    } catch (e) {
      showAlert('Failed to move channel');
    }
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      header: (props: NativeStackHeaderProps) => (
        <MyHeader {...props} title="Move to Category" />
      )
    });
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: colors.gray04 }}>
      <View style={styles.container}>
        <ButtonListText
          items={categories.map((category) => ({
            text: category.name,
            onPress: () => {
              handleMove(category.id);
            }
          }))}
        />
      </View>
    </View>
  );
};

export default Move;

const styles = StyleSheet.create({
  container: {
    padding: 16
  }
});
