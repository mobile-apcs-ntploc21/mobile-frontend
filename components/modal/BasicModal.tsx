import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View
} from 'react-native';
import React, { useState } from 'react';
import MyText from '../MyText';
import { TextStyles } from '@/styles/TextStyles';
import { colors } from '@/constants/theme';
import GlobalStyles from '@/styles/GlobalStyles';
import { MyButtonText } from '../MyButton';
import ButtonListCheckbox from '../ButtonList/ButtonListCheckbox';

export interface BasicModalProps {
  visible: boolean;
  onClose: () => void;
  title?: string;
  children?: React.ReactNode;
  onCancel?: () => void;
  cancelText?: string;
  onConfirm?: () => void;
  confirmText?: string;
}

const BasicModal = (props: BasicModalProps) => {
  const handleCancel = () => {
    props.onCancel && props.onCancel();
    props.onClose();
  };

  const handleConfirm = () => {
    props.onConfirm && props.onConfirm();
    props.onClose();
  };

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={props.visible}
      onRequestClose={() => {
        console.log('Modal has been closed.');
      }}
    >
      <TouchableWithoutFeedback onPress={props.onClose}>
        <View style={styles.modalContainer}>
          <TouchableWithoutFeedback>
            <View style={styles.modalView}>
              <View style={styles.contentContainer}>
                <MyText style={styles.title}>{props.title}</MyText>
                {props.children}
              </View>
              <View style={styles.buttonContainer}>
                <MyButtonText
                  title={props.cancelText || 'Cancel'}
                  reverseStyle
                  containerStyle={styles.smallButtonContainer}
                  textStyle={GlobalStyles.smallButtonText}
                  backgroundColor={colors.primary}
                  textColor={colors.white}
                  onPress={handleCancel}
                />
                <MyButtonText
                  showOutline={false}
                  title={props.confirmText || 'Confirm'}
                  containerStyle={styles.smallButtonContainer}
                  textStyle={GlobalStyles.smallButtonText}
                  onPress={handleConfirm}
                />
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default BasicModal;

const styles = StyleSheet.create({
  modalContainer: {
    ...GlobalStyles.container,
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.4)'
  },
  modalView: {
    paddingHorizontal: 16,
    paddingVertical: 24,
    backgroundColor: colors.gray04,
    borderRadius: 16,
    gap: 24,
    alignItems: 'center'
  },
  contentContainer: {
    width: '100%',
    gap: 24,
    alignItems: 'center'
  },
  title: {
    ...TextStyles.h5,
    textAlign: 'center'
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 8
  },
  smallButtonContainer: {
    ...GlobalStyles.smallButtonContainer,
    width: 112
  }
});
