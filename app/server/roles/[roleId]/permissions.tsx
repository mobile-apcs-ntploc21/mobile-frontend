import { Alert, StyleSheet, Text, View } from 'react-native';
import React, {
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState
} from 'react';
import { router, useLocalSearchParams, useNavigation } from 'expo-router';
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
import { getData, patchData } from '@/utils/api';
import useServers from '@/hooks/useServers';

type FormProps = {
  permissions: {
    [key: string]: boolean;
  };
};

const Permissions = () => {
  const navigation = useNavigation();
  const formRef = useRef<FormikProps<FormProps>>(null);
  const { roleId } = useLocalSearchParams<{ roleId: string }>();
  const { currentServerId } = useServers();

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

  const handleSubmit = async (
    values: FormProps,
    setErrors: (field: string, message: string | undefined) => void
  ) => {
    try {
      const permissions = Object.entries(values.permissions)
        .filter(([key, value]) => key !== 'ADMINISTRATOR')
        .map(([key, value]) => [key, value ? 'ALLOWED' : 'DENIED'])
        .reduce((acc, [key, value]) => {
          acc[key] = value;
          return acc;
        }, {} as { [key: string]: string });
      const permissionsResponse = await patchData(
        `/api/v1/servers/${currentServerId}/roles/${roleId}/permissions`,
        permissions
      );
      const isAdminResponse = await patchData(
        `/api/v1/servers/${currentServerId}/roles/${roleId}`,
        {
          is_admin: values.permissions.ADMINISTRATOR ? true : false
        }
      );
      router.back();
    } catch (e) {}
  };

  const [permissions, setPermissions] = useState<{
    [key: string]: 'ALLOWED' | 'DENIED';
  }>({});
  useEffect(() => {
    (async () => {
      try {
        console.log(
          `/api/v1/servers/${currentServerId}/roles/${roleId}/permissions`
        );
        const response = await getData(
          `/api/v1/servers/${currentServerId}/roles/${roleId}/permissions`
        );
        setPermissions(response);
      } catch (e: any) {
        console.error(e.message);
      }
    })();
  }, []);

  const [isAdmin, setIsAdmin] = useState(false);
  useEffect(() => {
    (async () => {
      try {
        const response = await getData(
          `/api/v1/servers/${currentServerId}/roles/${roleId}`
        );
        setIsAdmin(response.is_admin);
      } catch (e: any) {
        console.error(e.message);
      }
    })();
  }, []);

  // Need change to real permissions, edit only inside the permissions array
  const permissionsList = useMemo(() => {
    const permissionItem = (value: string, label: string) => ({
      value,
      label,
      isOn: permissions[value] === 'ALLOWED'
    });

    return [
      {
        title: 'General Permissions',
        permissions: [
          permissionItem('VIEW_CHANNEL', 'View Channels'),
          permissionItem('MANAGE_CHANNEL', 'Manage Channels'),
          permissionItem('CREATE_EXPRESSION', 'Create Expressions'),
          permissionItem('MANAGE_EXPRESSION', 'Manage Expressions'),
          permissionItem('MANAGE_SERVER', 'Manage Server')
        ]
      },
      {
        title: 'Membership Permissions',
        permissions: [
          permissionItem('MANAGE_INVITE', 'Manage Invite'),
          permissionItem('KICK_MEMBER', 'Kick Members'),
          permissionItem('BAN_MEMBER', 'Ban Members')
        ]
      },
      {
        title: 'Text Chat Permissions',
        permissions: [
          permissionItem('SEND_MESSAGE', 'Send Messages'),
          permissionItem('ATTACH_FILE', 'Attach Files'),
          permissionItem('ADD_REACTION', 'Add Reactions'),
          permissionItem('USE_EXTERNAL_EMOJI', 'Use External Emoji'),
          permissionItem('MENTION_ALL', 'Mention @everyone and Roles'),
          permissionItem('MANAGE_MESSAGE', 'Manage Messages')
        ]
      },
      {
        title: 'Voice Channel Permissions',
        permissions: [
          permissionItem('VOICE_CONNECT', 'Connect'),
          permissionItem('VOICE_SPEAK', 'Speak'),
          permissionItem('VOICE_VIDEO', 'Video'),
          permissionItem('VOICE_MUTE_MEMBER', 'Mute Members'),
          permissionItem('VOICE_DEAFEN_MEMBER', 'Deafen Members')
        ]
      },
      {
        title: 'Advanced Permissions',
        permissions: [
          {
            value: 'ADMINISTRATOR',
            label: 'Administrator',
            isOn: isAdmin
          }
        ]
      }
    ];
  }, [permissions, isAdmin]);

  const [searchText, setSearchText] = useState('');
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
        permissions: {
          ...Object.fromEntries(
            Object.entries(permissions).map(([key, value]) => [
              key,
              value === 'ALLOWED'
            ])
          ),
          ADMINISTRATOR: isAdmin
        }
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
                    }),
                  labelStyle: {
                    color:
                      permission.value === 'ADMINISTRATOR'
                        ? colors.semantic_red
                        : undefined
                  }
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
