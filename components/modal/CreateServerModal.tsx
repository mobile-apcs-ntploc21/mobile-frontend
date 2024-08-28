import {
  Modal,
  StyleSheet,
  TouchableWithoutFeedback,
  View
} from 'react-native';
import React, { useEffect, useState } from 'react';
import MyText from '../MyText';
import { TextStyles } from '@/styles/TextStyles';
import { colors } from '@/constants/theme';
import GlobalStyles from '@/styles/GlobalStyles';
import { MyButtonText } from '../MyButton';
import CustomTextInput from '../common/CustomTextInput';
import useServers from '@/hooks/useServers';

export interface CreateServerModalProps {
  visible: boolean;
  onClose: (isWithNewServer?: boolean) => void;
}

const CreateServerModal = (props: CreateServerModalProps) => {
  const { servers, setServers, selectServer } = useServers();
  const [serverName, setServerName] = useState('');
  const [newServerId, setNewServerId] = useState('');

  const handleConfirm = () => {
    // Create server here
    const newServers = [
      { id: servers.length.toString(), name: serverName },
      ...servers
    ];
    setServers(newServers, false, true);
    setNewServerId(newServers[0].id);
    props.onClose(true);
  };

  useEffect(() => {
    if (newServerId) {
      selectServer(newServerId);
      setNewServerId('');
    }
  }, [servers]);

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={props.visible}
      onRequestClose={() => {
        console.log('Modal has been closed.');
      }}
    >
      <TouchableWithoutFeedback onPress={() => props.onClose()}>
        <View style={styles.modalContainer}>
          <TouchableWithoutFeedback>
            <View style={styles.modalView}>
              <MyText style={styles.title}>Create Server</MyText>
              <MyText style={styles.bodyText}>
                What do you want to call this new server?
              </MyText>
              <CustomTextInput
                placeholder="Server name"
                value={serverName}
                onChangeText={setServerName}
              />
              <View style={styles.actions}>
                <MyButtonText
                  title="Cancel"
                  reverseStyle
                  containerStyle={styles.actionBtn}
                  textStyle={TextStyles.h3}
                  onPress={() => props.onClose()}
                />
                <MyButtonText
                  showOutline={false}
                  title="Confirm"
                  textStyle={TextStyles.h3}
                  containerStyle={styles.actionBtn}
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
    marginBottom: 8,
    textAlign: 'center'
  },
  actionBtn: {
    marginTop: 24,
    width: 112,
    height: 40
  }
});
