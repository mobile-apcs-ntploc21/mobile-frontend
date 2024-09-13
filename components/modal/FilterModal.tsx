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
import useServer from '@/hooks/useServer';
import { Role } from '@/types/server';

export interface FilterModalProps {
  visible: boolean;
  onClose: () => void;
}

const FilterModal = (props: FilterModalProps) => {
  const { customRoles } = useServer();
  const [selectedRoles, setSelectedRoles] = useState<Role[]>([]);

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
                  heading="Select Roles"
                  data={customRoles}
                  keyExtractor={(role: Role) => role.id}
                  labelExtractor={(role: Role) => role.name}
                  valueExtractor={(role: Role) => role}
                  compareValues={(a: Role, b: Role) => a.id === b.id}
                  scrollable
                  values={selectedRoles}
                  onAdd={(value: Role) => {
                    setSelectedRoles([...selectedRoles, value]);
                  }}
                  onRemove={(value: Role) => {
                    setSelectedRoles(
                      selectedRoles.filter((role) => role !== value)
                    );
                  }}
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
                onPress={props.onClose}
              />
              <MyButtonText
                showOutline={false}
                title="Show 4 results"
                containerStyle={{
                  marginTop: 10,
                  width: '100%',
                  height: 40
                }}
                textStyle={TextStyles.h3}
                onPress={props.onClose}
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
