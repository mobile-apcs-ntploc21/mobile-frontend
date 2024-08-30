import { Alert, StyleSheet, Text, View } from 'react-native';
import React, { useLayoutEffect, useMemo, useRef, useState } from 'react';
import { router, useNavigation } from 'expo-router';
import { Formik, FormikProps } from 'formik';
import { NativeStackHeaderProps } from '@react-navigation/native-stack';
import MyHeader from '@/components/MyHeader';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import MyText from '@/components/MyText';
import { TextStyles } from '@/styles/TextStyles';
import { colors, fonts } from '@/constants/theme';
import MyBottomSheetModal from '@/components/modal/MyBottomSheetModal';
import ColorPicker, {
  HueCircular,
  Panel1,
  returnedResults
} from 'reanimated-color-picker';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import CustomTextInput from '@/components/common/CustomTextInput';
import RoleIcon from '@/assets/icons/RoleIcon';
import IconWithSize from '@/components/IconWithSize';
import ColorizeIcon from '@/assets/icons/ColorizeIcon';
import ButtonListText from '@/components/ButtonList/ButtonListText';
import Accordion from '@/components/Accordion';
import Avatar from '@/components/Avatar';
import BasicModal from '@/components/modal/BasicModal';
import ButtonListToggle from '@/components/ButtonList/ButtonListToggle';
import SearchBar from '@/components/SearchBar';
import { frequencyMatch } from '@/utils/search';

type FormProps = {
  permissions: {
    [key: string]: boolean;
  };
};

// Mock permissions
const permissions = {
  PERM_1: 'ALLOW',
  PERM_2: 'DENY',
  PERM_3: 'ALLOW',
  PERM_4: 'DENY',
  PERM_5: 'ALLOW',
  PERM_6: 'DENY',
  PERM_7: 'ALLOW',
  PERM_8: 'DENY',
  PERM_9: 'ALLOW',
  PERM_10: 'DENY',
  PERM_11: 'ALLOW'
};

const Permissions = () => {
  const navigation = useNavigation();
  const formRef = useRef<FormikProps<FormProps>>(null);

  useLayoutEffect(() => {
    navigation.setOptions({
      header: (props: NativeStackHeaderProps) => (
        <MyHeader
          {...props}
          title="Role Permissions"
          headerRight={
            <TouchableOpacity
              onPress={async () => {
                if (formRef.current?.isSubmitting) return;
                await formRef.current?.submitForm();
                formRef.current?.setSubmitting(false);
              }}
            >
              <MyText style={styles.headerSave}>Save</MyText>
            </TouchableOpacity>
          }
          onGoBack={() =>
            new Promise((resolve, reject) => {
              if (!formRef.current?.dirty) return resolve();
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
  }, [formRef.current?.dirty]);

  const handleSubmit = (
    values: FormProps,
    setErrors: (field: string, message: string | undefined) => void
  ) => {
    console.log(values);
    try {
      // handle create here
    } catch (e) {}
  };

  const [searchText, setSearchText] = useState('');

  // Need change to real permissions, edit only inside the permissions array
  const permissionsList = useMemo(
    () => [
      {
        title: 'General Permissions',
        permissions: [
          {
            value: 'PERM_1',
            label: 'Permission 1',
            isOn: permissions['PERM_1'] === 'ALLOW'
          },
          {
            value: 'PERM_2',
            label: 'Permission 2',
            isOn: permissions['PERM_2'] === 'ALLOW'
          }
        ]
      },
      {
        title: 'Membership Permissions',
        permissions: [
          {
            value: 'PERM_3',
            label: 'Permission 3',
            isOn: permissions['PERM_3'] === 'ALLOW'
          },
          {
            value: 'PERM_4',
            label: 'Permission 4',
            isOn: permissions['PERM_4'] === 'ALLOW'
          }
        ]
      },
      {
        title: 'Text Chat Permissions',
        permissions: [
          {
            value: 'PERM_5',
            label: 'Permission 5',
            isOn: permissions['PERM_5'] === 'ALLOW'
          },
          {
            value: 'PERM_6',
            label: 'Permission 6',
            isOn: permissions['PERM_6'] === 'ALLOW'
          }
        ]
      },
      {
        title: 'Voice Channel Permissions',
        permissions: [
          {
            value: 'PERM_7',
            label: 'Permission 7',
            isOn: permissions['PERM_7'] === 'ALLOW'
          },
          {
            value: 'PERM_8',
            label: 'Permission 8',
            isOn: permissions['PERM_8'] === 'ALLOW'
          },
          {
            value: 'PERM_9',
            label: 'Permission 9',
            isOn: permissions['PERM_9'] === 'ALLOW'
          },
          {
            value: 'PERM_10',
            label: 'Permission 10',
            isOn: permissions['PERM_10'] === 'ALLOW'
          }
        ]
      },
      {
        title: 'Advanced Permissions',
        permissions: [
          {
            value: 'PERM_11',
            label: 'Permission 11',
            isOn: permissions['PERM_11'] === 'ALLOW'
          }
        ]
      }
    ],
    [permissions]
  );

  const filteredPermissionsList = useMemo(() => {
    if (!searchText) return permissionsList;
    const result = permissionsList.map((group) => ({
      ...group,
      permissions: group.permissions.filter((permission) =>
        frequencyMatch(permission.label, searchText)
      )
    }));
    return result.filter((group) => group.permissions.length > 0);
  }, [permissionsList, searchText]);

  return (
    <Formik
      innerRef={formRef}
      initialValues={{
        permissions: Object.fromEntries(
          Object.entries(permissions).map(([key, value]) => [
            key,
            value === 'ALLOW'
          ])
        )
      }}
      enableReinitialize
      onSubmit={(values, { setFieldError }) => {
        handleSubmit(values, setFieldError);
      }}
    >
      {({ values, setFieldValue }) => (
        <View
          style={{
            flex: 1,
            backgroundColor: colors.gray04
          }}
        >
          <View style={styles.topContainer}>
            <SearchBar value={searchText} onChangeText={setSearchText} />
          </View>
          <ScrollView contentContainerStyle={styles.botContainer}>
            {filteredPermissionsList.map((permissionGroup, index) => (
              <ButtonListToggle
                key={index}
                heading={permissionGroup.title}
                items={permissionGroup.permissions.map((permission, index) => ({
                  value: permission.value,
                  label: permission.label,
                  isOn: values.permissions[permission.value],
                  onChange: (isOn) =>
                    setFieldValue('permissions', {
                      ...values.permissions,
                      [permission.value]: isOn
                    })
                }))}
              />
            ))}
          </ScrollView>
        </View>
      )}
    </Formik>
  );
};

export default Permissions;

const styles = StyleSheet.create({
  headerSave: {
    ...TextStyles.h3,
    color: colors.primary
  },
  topContainer: {
    padding: 16
  },
  botContainer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    gap: 16
  }
});
