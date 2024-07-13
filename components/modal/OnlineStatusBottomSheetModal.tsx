import { StyleSheet, Text, View } from 'react-native';
import React, { forwardRef, useCallback } from 'react';
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetView
} from '@gorhom/bottom-sheet';
import { TextStyles } from '@/styles/TextStyles';
import { colors } from '@/constants/theme';

interface OnlineStatusBottomSheetModalProps {
  title: string;
}
type Ref = BottomSheetModal;

const OnlineStatusBottomSheetModal = forwardRef<
  Ref,
  OnlineStatusBottomSheetModalProps
>((props, ref) => {
  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        {...props}
      />
    ),
    []
  );
  return (
    <BottomSheetModal
      ref={ref}
      enableDynamicSizing={true}
      backdropComponent={renderBackdrop}
      // contentStyle={{ backgroundColor: colors.gray03 }}
      backgroundStyle={{ backgroundColor: colors.gray03 }}
    >
      <BottomSheetView style={styles.container}>
        <Text style={TextStyles.h4}>Change Online Status</Text>
        <View style={styles.placeholder} />
      </BottomSheetView>
    </BottomSheetModal>
  );
});

export default OnlineStatusBottomSheetModal;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 8,
    gap: 16,
    alignItems: 'center',
    paddingBottom: 8
  },
  placeholder: {
    width: '100%',
    height: 200,
    borderRadius: 21,
    backgroundColor: colors.white
  }
});
