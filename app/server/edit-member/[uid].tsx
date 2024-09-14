import { useLocalSearchParams, useNavigation } from 'expo-router';
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState
} from 'react';
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
import useServer from '@/hooks/useServer';
import { deleteData, postData, putData } from '@/utils/api';
import useServers from '@/hooks/useServers';

const EditMember = () => {
  const { uid } = useLocalSearchParams();
  const { currentServerId } = useServers();
  const { members, customRoles } = useServer();

  const navigation = useNavigation();
  const formikRef = useRef<FormikProps<any>>(null);
  const [editState, setEditState] = useState(false);

  const handleSubmit = useCallback((newRoles: Role[]) => {
    // remove roles
    currentRoles.forEach((role) => {
      if (!newRoles.find((newRole) => newRole.id === role.id)) {
        deleteData(
          `/api/v1/servers/${currentServerId}/roles/${role.id}/members/${uid}`
        );
      }
    });
    // add roles
    newRoles.forEach((role) => {
      if (!currentRoles.find((currentRole) => currentRole.id === role.id)) {
        postData(
          `/api/v1/servers/${currentServerId}/roles/${role.id}/members/${uid}`
        );
      }
    });
  }, []);

  const currentRoles = useMemo(() => {
    const tmp = members.find((member) => member.user_id === uid)!.roles;
    if (!tmp) return [];

    return tmp;
  }, [members, uid]);

  // Set the formik to the current roles
  useEffect(() => {
    formikRef.current?.setValues({
      roles: currentRoles
    });
  }, [currentRoles]);

  const actions = useMemo(
    () => [
      {
        text: 'Kick',
        onPress: () => {
          putData(
            `/api/v1/servers/${currentServerId}/kick/${uid}`,
            {},
            {},
            false
          );
          navigation.canGoBack() && navigation.goBack();
        }
      },
      {
        text: 'Ban',
        onPress: () => {
          putData(`/api/v1/servers/${currentServerId}/bans/${uid}`);
          navigation.canGoBack() && navigation.goBack();
        }
      }
    ],
    []
  );

  const onwershipAction = useMemo(
    () => [
      {
        text: 'Transfer ownership',
        onPress: () => {
          postData(`/api/v1/servers/${currentServerId}/transfer-ownership/`, {
            user_id: uid
          });
        }
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
          roles: currentRoles
        }}
        onSubmit={(values) => {
          handleSubmit(values.roles);
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
                data={customRoles}
                values={values.roles}
                keyExtractor={(role: Role) => role.id}
                labelExtractor={(role: Role) => role.name}
                valueExtractor={(role: Role) => role}
                compareValues={(a: Role, b: Role) => a.id === b.id}
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
                      value: values.roles.filter(
                        (role: Role) => role.id !== value.id
                      )
                    }
                  })
                }
              />
            ) : (
              <ButtonListText
                heading="Roles"
                items={values.roles.map((role: Role) => ({
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
