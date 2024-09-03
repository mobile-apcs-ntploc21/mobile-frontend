import { useNavigation } from 'expo-router';
import { useLayoutEffect, useMemo, useRef, useState } from 'react';
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View
} from 'react-native';
import { NativeStackHeaderProps } from '@react-navigation/native-stack';
import { Formik, FormikProps } from 'formik';

import MyHeader from '@/components/MyHeader';
import { colors, fonts } from '@/constants/theme';
import MyText from '@/components/MyText';
import ButtonListText from '@/components/ButtonList/ButtonListText';
import { Role } from '@/types/server';
import ButtonListCheckbox from '@/components/ButtonList/ButtonListCheckbox';

const EditMember = () => {
  const navigation = useNavigation();
  const formikRef = useRef<FormikProps<any>>(null);
  const [editState, setEditState] = useState(false);

  const roles: Role[] = useMemo(
    () => [
      {
        id: '1',
        name: 'Admin',
        color: '#FF0000'
      },
      {
        id: '2',
        name: 'Moderator',
        color: '#00FF00'
      },
      {
        id: '3',
        name: 'Member',
        color: '#0000FF'
      },
      {
        id: '4',
        name: 'Guest',
        color: '#FFFF00'
      }
    ],
    []
  );

  const actions = useMemo(
    () => [
      {
        text: 'Kick',
        onPress: () => {}
      },
      {
        text: 'Ban',
        onPress: () => {}
      }
    ],
    []
  );

  const onwershipAction = useMemo(
    () => [
      {
        text: 'Transfer ownership',
        onPress: () => {}
      }
    ],
    []
  );

  useLayoutEffect(() => {
    navigation.setOptions({
      header: (props: NativeStackHeaderProps) => (
        <MyHeader
          {...props}
          title="Edit member"
          headerRight={
            <TouchableOpacity onPress={() => formikRef.current?.submitForm()}>
              <MyText style={styles.save}>Save</MyText>
            </TouchableOpacity>
          }
          onGoBack={() =>
            new Promise((resolve, reject) => {
              Alert.alert(
                'Discard changes',
                'Are you sure you want to discard changes?',
                [
                  {
                    text: 'No',
                    style: 'cancel',
                    onPress: () => reject()
                  },
                  {
                    text: 'Yes',
                    style: 'destructive',
                    onPress: () => resolve()
                  }
                ]
              );
            })
          }
        />
      )
    });
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Formik
        innerRef={formikRef}
        initialValues={{
          nickname: '',
          roles: roles
        }}
        onSubmit={(values) => {
          console.log(values);
          navigation.goBack();
        }}
      >
        {({ handleChange, handleBlur, values }) => (
          <View>
            <TouchableOpacity
              style={styles.btnEdit}
              onPress={() => setEditState(!editState)}
            >
              <MyText style={styles.editText}>
                {editState ? 'Cancel' : 'Edit'}
              </MyText>
            </TouchableOpacity>
            {editState ? (
              <ButtonListCheckbox
                heading="Roles"
                items={roles.map((role) => ({
                  value: role.id,
                  label: role.name
                }))}
                values={values.roles}
                onAdd={(value) =>
                  handleChange({
                    target: {
                      name: 'roles',
                      value: [...values.roles, value]
                    }
                  })
                }
                onRemove={(value) =>
                  handleChange({
                    target: {
                      name: 'roles',
                      value: values.roles.filter((role) => role.id !== value)
                    }
                  })
                }
              />
            ) : (
              <ButtonListText
                heading="Roles"
                items={values.roles.map((role) => ({
                  text: role.name
                }))}
              />
            )}
          </View>
        )}
      </Formik>
      <ButtonListText
        heading="Actions"
        items={actions.map((action) => ({
          ...action,
          style: { color: colors.semantic_red }
        }))}
      />
      <ButtonListText heading="Ownership Action" items={onwershipAction} />
    </ScrollView>
  );
};

export default EditMember;

const styles = StyleSheet.create({
  container: {
    padding: 16,
    gap: 16
  },
  save: {
    color: colors.primary,
    fontSize: 20,
    fontFamily: fonts.medium
  },
  label: {
    fontSize: 12,
    fontFamily: fonts.black
  },
  input: {
    fontSize: 23,
    fontFamily: fonts.regular
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
