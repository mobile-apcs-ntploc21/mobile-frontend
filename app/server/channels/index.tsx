import { NativeStackHeaderProps } from '@react-navigation/native-stack';
import { router, useNavigation } from 'expo-router';
import { useCallback, useLayoutEffect, useMemo, useRef } from 'react';
import { FlatList, StyleSheet, TouchableOpacity, View } from 'react-native';

import ButtonListText from '@/components/ButtonList/ButtonListText';
import { MyButtonText } from '@/components/MyButton';
import MyHeader from '@/components/MyHeader';
import MyText from '@/components/MyText';
import MyBottomSheetModal from '@/components/modal/MyBottomSheetModal';
import { colors, fonts } from '@/constants/theme';
import useServer from '@/hooks/useServer';
import GlobalStyles from '@/styles/GlobalStyles';
import { TextStyles } from '@/styles/TextStyles';
import { BottomSheetModal } from '@gorhom/bottom-sheet';

const Channels = () => {
  const { categories } = useServer();
  const navigation = useNavigation();
  const bottomSheetModalRef = useRef<BottomSheetModal>(null); // For reorder
  const bottomSheetModalRef2 = useRef<BottomSheetModal>(null); // For create

  const createActions = useMemo(
    () => [
      {
        text: 'Create category',
        onPress: () => {
          handleClose2();
          router.navigate('./create_category');
        }
      },
      {
        text: 'Create channel',
        onPress: () => {
          handleClose2();
          router.navigate('./create_channel');
        }
      }
    ],
    []
  );

  const reorderActions = useMemo(
    () => [
      {
        text: 'Reorder categories',
        onPress: () => {
          handleClose();
          router.navigate('./reorder_categories');
        }
      },
      {
        text: 'Reorder channels',
        onPress: () => {
          handleClose();
          router.navigate('./reorder_channels');
        }
      }
    ],
    []
  );

  const handleOpen = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, [bottomSheetModalRef]);

  const handleClose = useCallback(() => {
    bottomSheetModalRef.current?.close();
  }, [bottomSheetModalRef]);

  const handleOpen2 = useCallback(() => {
    bottomSheetModalRef2.current?.present();
  }, [bottomSheetModalRef2]);

  const handleClose2 = useCallback(() => {
    bottomSheetModalRef2.current?.close();
  }, [bottomSheetModalRef2]);

  useLayoutEffect(() => {
    navigation.setOptions({
      header: (props: NativeStackHeaderProps) => (
        <MyHeader
          {...props}
          title="Channels"
          headerRight={
            <TouchableOpacity onPress={handleOpen}>
              <MyText style={styles.headerEdit}>Reorder</MyText>
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
        onClose={() => {
          console.log('Close bottom modal');
        }}
      >
        <ButtonListText heading="Reorder" items={reorderActions} />
      </MyBottomSheetModal>
      <MyBottomSheetModal
        ref={bottomSheetModalRef2}
        onClose={() => {
          console.log('Close bottom modal');
        }}
      >
        <ButtonListText heading="Create" items={createActions} />
      </MyBottomSheetModal>
      <FlatList
        data={categories}
        keyExtractor={(item) => item.id ?? ''}
        renderItem={({ item: { id, name, channels } }) => (
          <View>
            <TouchableOpacity
              style={styles.normalEdit}
              onPress={() =>
                router.navigate({
                  pathname: `./edit_category/${id}`,
                  params: { categoryName: name }
                })
              }
            >
              {name !== 'Uncategorized' && (
                <MyText style={styles.normalEditText}>Edit</MyText>
              )}
            </TouchableOpacity>
            <ButtonListText
              heading={name}
              items={channels.map(({ id, name, description }) => ({
                text: name,
                onPress: () =>
                  router.navigate({
                    pathname: `./edit_channel/${id}`,
                    params: {
                      channelName: name,
                      description: description
                    }
                  })
              }))}
            />
          </View>
        )}
        ListFooterComponent={<View style={{ height: 16 }} />}
        contentContainerStyle={{ gap: 16 }}
        style={styles.container}
      />
      <View style={styles.createContainer}>
        <MyButtonText
          title="+ Create"
          onPress={handleOpen2}
          backgroundColor={colors.primary}
          textColor={colors.white}
          containerStyle={{ width: 150 }}
          textStyle={TextStyles.h3}
        />
      </View>
    </View>
  );
};

export default Channels;

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
  createContainer: {
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: 24,
    backgroundColor: 'transparent'
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
