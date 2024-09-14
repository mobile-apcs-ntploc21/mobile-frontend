import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View
} from 'react-native';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import MyText from '../MyText';
import { TextStyles } from '@/styles/TextStyles';
import { colors } from '@/constants/theme';
import GlobalStyles from '@/styles/GlobalStyles';
import { MyButtonText } from '../MyButton';
import ButtonListCheckbox from '../ButtonList/ButtonListCheckbox';
import useServer from '@/hooks/useServer';
import { Role } from '@/types/server';

export interface FilterModalProps {
  visible: boolean;
  onClose: (roleIds: string[], justClose?: boolean) => void;
}

const FilterModal = (props: FilterModalProps) => {
  const { customRoles } = useServer();
  const [selectedRoleIds, setSelectedRoleIds] = useState<string[]>([]);
  const [lastSavedRoleIds, setLastSavedRoleIds] =
    useState<string[]>(selectedRoleIds);

  const handleClose = useCallback(
    (justClose?: boolean) => {
      if (!justClose) setLastSavedRoleIds(selectedRoleIds);
      props.onClose(selectedRoleIds, justClose);
    },
    [props.onClose, selectedRoleIds]
  );

  useEffect(() => {
    if (props.visible) setSelectedRoleIds(lastSavedRoleIds);
  }, [props.visible]);

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={props.visible}
      onRequestClose={() => {
        console.log('Modal has been closed.');
      }}
    >
      <TouchableWithoutFeedback onPress={() => handleClose(true)}>
        <View style={styles.modalContainer}>
          <TouchableWithoutFeedback>
            <View style={styles.modalView}>
              <MyText style={styles.title}>Filter</MyText>
              <View style={styles.body}>
                <MyText style={[TextStyles.bodyM, { color: colors.gray02 }]}>
                  You can select multiple roles
                </MyText>
              </View>
              <View
                style={{
                  flex: 1,
                  marginTop: 8,
                  marginBottom: 16
                }}
              >
                <ButtonListCheckbox
                  scrollable
                  heading="Select Roles"
                  data={customRoles}
                  values={selectedRoleIds}
                  labelExtractor={(role) => role.name}
                  valueExtractor={(role) => role.id}
                  keyExtractor={(role) => role.id}
                  compareValues={(a, b) => a === b}
                  onAdd={(value) => {
                    console.log(value);
                    setSelectedRoleIds([...selectedRoleIds, value]);
                  }}
                  onRemove={(value) =>
                    setSelectedRoleIds(
                      selectedRoleIds.filter((id) => id !== value)
                    )
                  }
                />
              </View>
              <MyButtonText
                title="Cancel"
                reverseStyle
                containerStyle={{
                  marginTop: 'auto',
                  width: '100%',
                  height: 40
                }}
                textStyle={TextStyles.h3}
                onPress={() => handleClose(true)}
              />
              <MyButtonText
                showOutline={false}
                title="Show results"
                containerStyle={{
                  marginTop: 10,
                  width: '100%',
                  height: 40
                }}
                textStyle={TextStyles.h3}
                onPress={() => handleClose(false)}
              />
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default FilterModal;

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
  body: {
    marginTop: 24
  }
});
