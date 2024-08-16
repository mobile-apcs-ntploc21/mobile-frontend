import {
  Modal,
  StyleSheet,
  TouchableWithoutFeedback,
  View
} from 'react-native';
import React, { useState } from 'react';
import MyText from '../MyText';
import { TextStyles } from '@/styles/TextStyles';
import { colors } from '@/constants/theme';
import GlobalStyles from '@/styles/GlobalStyles';
import { MyButtonText } from '../MyButton';
import CustomTextInput from '../common/CustomTextInput';

export interface CreateServerModalProps {
  visible: boolean;
  onClose: () => void;
}

const CreateServerModal = (props: CreateServerModalProps) => {
  const [serverName, setServerName] = useState('');

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
              <MyText style={styles.title}>Create Server</MyText>
              <MyText style={styles.bodyText}>
                What do you want to call this new server?
              </MyText>
              <CustomTextInput
                title="server_name"
                placeholder="Server name"
                value={serverName}
                onChangeText={setServerName}
              />
              <View style={styles.actions}>
                <MyButtonText
                  title="Cancel"
                  reverseStyle
                  containerStyle={styles.actionBtn}
                  onPress={props.onClose}
                />
                <MyButtonText
                  showOutline={false}
                  title="Show 4 results"
                  containerStyle={styles.actionBtn}
                  onPress={props.onClose}
                />
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default CreateServerModal;

const styles = StyleSheet.create({
  modalContainer: {
    ...GlobalStyles.container,
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)'
  },
  modalView: {
    padding: 16,
    height: 480,
    backgroundColor: colors.gray04,
    borderRadius: 16
  },
  title: {
    ...TextStyles.h5,
    textAlign: 'center'
  },
  actions: {
    columnGap: 8,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  bodyText: {
    ...TextStyles.bodyM,
    marginTop: 24,
    textAlign: 'center'
  },
  actionBtn: {
    width: 112,
    height: 40
  }
});
