import { FlatList, StyleSheet, View, TouchableOpacity } from 'react-native';
import React, { useCallback, useLayoutEffect, useMemo, useRef } from 'react';
import { router, useNavigation } from 'expo-router';
import { NativeStackHeaderProps } from '@react-navigation/native-stack';

import MyHeader from '@/components/MyHeader';
import GlobalStyles from '@/styles/GlobalStyles';
import ButtonListText from '@/components/ButtonList/ButtonListText';
import useServers from '@/hooks/useServers';
import MyBottomSheetModal from '@/components/modal/MyBottomSheetModal';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import MyText from '@/components/MyText';
import { colors, fonts } from '@/constants/theme';

const Settings = () => {
  const { categories } = useServers();
  const navigation = useNavigation();
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  const createActions = useMemo(
    () => [
      {
        text: 'Create category',
        onPress: () => {}
      },
      {
        text: 'Create channel',
        onPress: () => {}
      }
    ],
    []
  );

  const reorderActions = useMemo(
    () => [
      {
        text: 'Reorder categories',
        onPress: () => {}
      },
      {
        text: 'Reorder channels',
        onPress: () => {}
      }
    ],
    []
  );

  const handleOpen = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, [bottomSheetModalRef]);

  useLayoutEffect(() => {
    navigation.setOptions({
      header: (props: NativeStackHeaderProps) => (
        <MyHeader
          {...props}
          title="Channels"
          headerRight={
            <TouchableOpacity onPress={handleOpen}>
              <MyText style={styles.headerEdit}>Edit</MyText>
            </TouchableOpacity>
          }
        />
      )
    });
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <MyBottomSheetModal
        ref={bottomSheetModalRef}
        heading="Edit"
        onClose={() => {
          console.log('Close bottom modal');
        }}
      >
        <ButtonListText heading="Create" items={createActions} />
        <ButtonListText heading="Reorder" items={reorderActions} />
      </MyBottomSheetModal>
      <FlatList
        data={categories}
        keyExtractor={(item) => item.id}
        renderItem={({ item: { name, channels } }) => (
          <View>
            <TouchableOpacity
              style={styles.normalEdit}
              onPress={() => console.log(`Pressed ${name}`)}
            >
              <MyText style={styles.normalEditText}>Edit</MyText>
            </TouchableOpacity>
            <ButtonListText
              heading={name}
              items={channels.map(({ name }) => ({ text: name }))}
            />
          </View>
        )}
        ListFooterComponent={<View style={{ height: 16 }} />}
        contentContainerStyle={{ gap: 16 }}
        style={styles.container}
      />
    </View>
  );
};

export default Settings;

const styles = StyleSheet.create({
  container: {
    ...GlobalStyles.container,
    flex: 1,
    paddingVertical: 16
  },
  headerEdit: {
    fontSize: 20,
    fontFamily: fonts.medium,
    color: colors.primary
  },
  normalEdit: {
    position: 'absolute',
    zIndex: 999,
    top: 0,
    right: 16
  },
  normalEditText: {
    fontSize: 14,
    fontFamily: fonts.bold,
    color: colors.primary
  }
});
