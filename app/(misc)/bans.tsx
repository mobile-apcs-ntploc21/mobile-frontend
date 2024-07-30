import { StyleSheet, View } from 'react-native';
import { useCallback, useLayoutEffect, useRef } from 'react';
import { useNavigation } from 'expo-router';
import { NativeStackHeaderProps } from '@react-navigation/native-stack';
import { BottomSheetModal } from '@gorhom/bottom-sheet';

import SearchBar from '@/components/SearchBar';
import GlobalStyles from '@/styles/GlobalStyles';
import ButtonListBase from '@/components/ButtonList/ButtonListBase';
import MyHeader from '@/components/MyHeader';
import UserBanItem from '@/components/userManagment/UserBanItem';
import MyBottomSheetModal from '@/components/modal/MyBottomSheetModal';
import ButtonListText from '@/components/ButtonList/ButtonListText';

const Bans = () => {
  const navigation = useNavigation();
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  const handleOpenBottomSheet = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, [bottomSheetModalRef]);

  const handleCloseBottomSheet = useCallback(() => {
    bottomSheetModalRef.current?.dismiss();
  }, [bottomSheetModalRef]);

  useLayoutEffect(() => {
    navigation.setOptions({
      header: (props: NativeStackHeaderProps) => (
        <MyHeader {...props} title="Bans" />
      )
    });
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <MyBottomSheetModal
        ref={bottomSheetModalRef}
        heading="username"
        onClose={() => {
          console.log('Close bottom modal');
        }}
      >
        <ButtonListText
          items={[{ text: 'Unban', onPress: handleCloseBottomSheet }]}
        />
      </MyBottomSheetModal>
      <View style={GlobalStyles.container}>
        <View style={styles.searchContainer}>
          <View style={{ flex: 1 }}>
            <SearchBar />
          </View>
        </View>
        <ButtonListBase
          scrollable
          items={Array.from({ length: 20 }, (_, index) => ({
            itemComponent: <UserBanItem />,
            onPress: handleOpenBottomSheet
          }))}
        />
      </View>
    </View>
  );
};

export default Bans;

const styles = StyleSheet.create({
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 13,
    marginBottom: 16
  }
});
