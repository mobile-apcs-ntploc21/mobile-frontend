import {
  Modal,
  StyleSheet,
  ToastAndroid,
  TouchableWithoutFeedback,
  View
} from 'react-native';
import React, { useCallback, useEffect, useState } from 'react';
import MyText from '../MyText';
import { TextStyles } from '@/styles/TextStyles';
import { colors } from '@/constants/theme';
import GlobalStyles from '@/styles/GlobalStyles';
import { MyButtonText } from '../MyButton';
import CustomTextInput from '../common/CustomTextInput';
import useServers from '@/hooks/useServers';
import { getData, postData } from '@/utils/api';
import { ServersActions } from '@/context/ServersProvider';

export interface AddMemberModalProps {
  visible: boolean;
  onClose: () => void;
}

const AddMemberModal = (props: AddMemberModalProps) => {
  const { currentServerId } = useServers();
  const [username, setUsername] = useState('');

  const handleConfirm = useCallback(async () => {
    try {
      // Validate username name
      if (username.length === 0) {
        return;
      }

      const profile = await getData(`/api/v1/profile/u/${username}`);

      if (!profile) {
        props.onClose();
        throw new Error('Failed to invite this member.');
      }

      await postData(`/api/v1/servers/${currentServerId}/owner/members`, {
        user_ids: [profile.user_id]
      });

      ToastAndroid.show('Member has been invited.', ToastAndroid.SHORT);
    } catch (error) {
      ToastAndroid.show('Failed to invite this member.', ToastAndroid.SHORT);
    }
  }, [username, currentServerId]);

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
              <MyText style={styles.title}>Invite a Member</MyText>
              <MyText style={styles.bodyText}>
                Enter a username and they will be added into your server
              </MyText>
              <CustomTextInput
                placeholder="Username"
                value={username}
                onChangeText={setUsername}
                errorMessage={
                  username.length === 0 ? 'Username is required' : ''
                }
              />
              <View style={styles.actions}>
                <MyButtonText
                  title="Cancel"
                  reverseStyle
                  containerStyle={styles.actionBtn}
                  textStyle={TextStyles.h3}
                  onPress={props.onClose}
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

export default AddMemberModal;

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
