import { useNavigation } from 'expo-router';
import { useLayoutEffect, useRef, useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableWithoutFeedback,
  View
} from 'react-native';
import { NativeStackHeaderProps } from '@react-navigation/native-stack';
import { Formik, FormikProps } from 'formik';

import MyHeader from '@/components/MyHeader';
import { colors, fonts } from '@/constants/theme';
import MyText from '@/components/MyText';
import GlobalStyles from '@/styles/GlobalStyles';
import Avatar from '@/components/Avatar';
import ButtonListText from '@/components/ButtonList/ButtonListText';
import ButtonListCheckbox from '@/components/ButtonList/ButtonListCheckbox';

const defaultRoles = Array.from(
  { length: 7 },
  (_, index) => `Role ${index + 1}`
);

const defaultActions = Array.from(
  { length: 3 },
  (_, index) => `Action ${index + 1}`
);

const EditMember = () => {
  const navigation = useNavigation();
  const formikRef = useRef<FormikProps<any>>(null);
  const [editState, setEditState] = useState(false);

  useLayoutEffect(() => {
    navigation.setOptions({
      header: (props: NativeStackHeaderProps) => (
        <MyHeader
          {...props}
          title="Edit member"
          headerRight={
            <TouchableWithoutFeedback
              onPress={() => formikRef.current?.submitForm()}
            >
              <MyText style={styles.save}>Save</MyText>
            </TouchableWithoutFeedback>
          }
        />
      )
    });
  }, []);

  return (
    <ScrollView style={GlobalStyles.container}>
      <Formik
        innerRef={formikRef}
        initialValues={{
          nickname: '',
          roles: defaultRoles.slice(0, 2)
        }}
        onSubmit={(values) => {
          console.log(values);
          navigation.goBack();
        }}
      >
        {({ handleChange, handleBlur, values }) => (
          <View>
            <View style={styles.nicknameContainer}>
              <Avatar
                id="#"
                avatarStyle={{
                  width: 64,
                  height: 64,
                  borderRadius: 32
                }}
              />
              <View style={styles.nicknameBlock}>
                <MyText style={styles.label}>NICKNAME</MyText>
                <TextInput
                  style={styles.input}
                  value={values.nickname}
                  onChangeText={handleChange('nickname')}
                  onBlur={handleBlur('nickname')}
                  placeholder="Add a nickname"
                  placeholderTextColor={colors.gray02}
                />
              </View>
            </View>
            <View style={styles.rolesContainer}>
              <Pressable
                style={styles.btnEdit}
                onPress={() => setEditState(!editState)}
              >
                <MyText style={styles.editText}>
                  {editState ? 'Cancel' : 'Edit'}
                </MyText>
              </Pressable>
              {editState ? (
                <ButtonListCheckbox
                  heading="Roles"
                  items={defaultRoles.map((role) => ({
                    value: role,
                    label: role
                  }))}
                  values={values.roles}
                  onAdd={(value) =>
                    handleChange({
                      target: { name: 'roles', value: [...values.roles, value] }
                    })
                  }
                  onRemove={(value) =>
                    handleChange({
                      target: {
                        name: 'roles',
                        value: values.roles.filter(
                          (role: string) => role !== value
                        )
                      }
                    })
                  }
                />
              ) : (
                <ButtonListText
                  heading="Roles"
                  items={values.roles.map((role: string) => ({
                    text: role
                  }))}
                />
              )}
            </View>
          </View>
        )}
      </Formik>
      <View style={styles.actionsContainer}>
        <ButtonListText
          heading="Actions"
          items={defaultActions.map((action) => ({
            text: action,
            style: { color: colors.semantic_red },
            onPress: () => console.log(action)
          }))}
        />
      </View>
    </ScrollView>
  );
};

export default EditMember;

const styles = StyleSheet.create({
  save: {
    color: colors.primary,
    fontSize: 20,
    fontFamily: fonts.medium
  },
  nicknameContainer: {
    flexDirection: 'row',
    gap: 16,
    alignItems: 'flex-start'
  },
  nicknameBlock: {
    flex: 1,
    height: 71,
    padding: 8,
    gap: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray02
  },
  label: {
    fontSize: 12,
    fontFamily: fonts.black
  },
  input: {
    fontSize: 23,
    fontFamily: fonts.regular
  },
  rolesContainer: {
    marginTop: 32
  },
  actionsContainer: {
    marginTop: 16
  },
  btnEdit: {
    position: 'absolute',
    right: 16,
    top: 0,
    zIndex: 1
  },
  editText: {
    fontSize: 14,
    fontFamily: fonts.bold,
    color: colors.primary
  }
});
