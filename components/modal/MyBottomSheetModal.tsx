import { StyleSheet, Text, View } from 'react-native';
import React, { forwardRef, useCallback } from 'react';
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetView
} from '@gorhom/bottom-sheet';
import { TextStyles } from '@/styles/TextStyles';
import { colors } from '@/constants/theme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface MyBottomSheetModalProps {
  onClose: () => void;
  heading?: string;
  children?: React.ReactNode;
}
type Ref = BottomSheetModal;

const MyBottomSheetModal = forwardRef<Ref, MyBottomSheetModalProps>(
  (props, ref) => {
    const insets = useSafeAreaInsets();

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
        backgroundStyle={{
          backgroundColor: colors.gray03,
          borderTopLeftRadius: 30,
          borderTopRightRadius: 30
        }}
      >
        <BottomSheetView
          style={[styles.container, { paddingBottom: 8 + insets.bottom }]}
        >
          {props.heading && <Text style={TextStyles.h4}>{props.heading}</Text>}
          {props.children}
        </BottomSheetView>
      </BottomSheetModal>
    );
  }
);

export default MyBottomSheetModal;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 8,
    gap: 16,
    alignItems: 'center',
    paddingBottom: 8
  }
});
