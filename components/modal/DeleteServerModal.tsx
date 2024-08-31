import { colors, fonts } from '@/constants/theme';
import useServers from '@/hooks/useServers';
import GlobalStyles from '@/styles/GlobalStyles';
import { TextStyles } from '@/styles/TextStyles';
import { deleteData, postData } from '@/utils/api';
import { useEffect, useState } from 'react';
import {
  Modal,
  StyleSheet,
  TouchableWithoutFeedback,
  View
} from 'react-native';
import { MyButtonText } from '../MyButton';
import MyText from '../MyText';
import CustomTextInput from '../common/CustomTextInput';
import { Server } from '@/types';
import { router } from 'expo-router';
import { showAlert } from '@/services/alert';

interface DeleteServerModalProps {
  currentServer?: Server;
  visible: boolean;
  onClose: (isWithNewServer?: boolean) => void;
}

const DeleteServerModal = (props: DeleteServerModalProps) => {
  const { servers, setServers, selectServer } = useServers();
  const [serverName, setServerName] = useState('');

  const handleConfirm = async () => {
    if (serverName !== props.currentServer?.name) return;

    try {
      const response = await deleteData(
        `/api/v1/servers/${props.currentServer?.id}`
      );

      if (response) {
        // Remove server from servers list
        const newServers = servers.filter(
          (server) => server.id !== props.currentServer?.id
        );

        setServers(newServers, false);
        if (newServers.length) {
          selectServer(newServers[0].id);
        }
      }

      props.onClose(true);
      // Go back to home screen
      while (router.canGoBack()) {
        router.back();
      }
    } catch (err: any) {
      showAlert(err.message);
    }
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
      <TouchableWithoutFeedback onPress={() => props.onClose()}>
        <View style={styles.modalContainer}>
          <TouchableWithoutFeedback>
            <View style={styles.modalView}>
              <MyText style={styles.title}>Delete Server</MyText>
              <MyText style={styles.bodyText}>
                Are you sure you want to delete{' '}
                <MyText style={styles.boldText}>
                  {props.currentServer?.name}
                </MyText>
                ? This action cannot be undone.
              </MyText>
              <CustomTextInput
                title="ENTER SERVER NAME"
                placeholder="Server name"
                value={serverName}
                onChangeText={setServerName}
                errorMessage={
                  serverName !== props.currentServer?.name
                    ? 'Server name does not match'
                    : ''
                }
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
                  backgroundColor={colors.semantic_red}
                  textColor={colors.white}
                  containerStyle={styles.actionBtn}
                  onPress={handleConfirm}
                  disabled={serverName !== props.currentServer?.name}
                />
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default DeleteServerModal;

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
    ...TextStyles.h3,
    textAlign: 'center'
  },
  actions: {
    columnGap: 20,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center'
  },
  bodyText: {
    ...TextStyles.bodyL,
    fontSize: 14,
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'left'
  },
  boldText: {
    ...TextStyles.bodyL,
    fontFamily: fonts.bold
  },
  actionBtn: {
    marginTop: 24,
    width: 112,
    height: 40
  }
});
