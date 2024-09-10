import {
  ActivityIndicator,
  Alert,
  Image,
  StyleSheet,
  Text,
  View
} from 'react-native';
import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { router, useLocalSearchParams, useNavigation } from 'expo-router';
import { Formik, FormikProps } from 'formik';
import { NativeStackHeaderProps } from '@react-navigation/native-stack';
import MyHeader from '@/components/MyHeader';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import MyText from '@/components/MyText';
import { TextStyles } from '@/styles/TextStyles';
import { colors, fonts } from '@/constants/theme';
import MyBottomSheetModal from '@/components/modal/MyBottomSheetModal';
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
import MyColorPicker from '@/components/MyColorPicker';
import { deleteData, getData, patchData, postData } from '@/utils/api';
import useServers from '@/hooks/useServers';
import { showAlert } from '@/services/alert';
import useServer from '@/hooks/useServer';
import { ServerActions } from '@/context/ServerProvider';
import { ServerProfile } from '@/types';
import { useGlobalContext } from '@/context/GlobalProvider';
import { DefaultProfileImage } from '@/constants/images';
import { Member } from '@/types/server';

type FormProps = {
  roleTitle: string;
  roleColor: string;
  allowMention: boolean;
};

const RoleEdit = () => {
  const { currentServerId } = useServers();
  const { roles, dispatch } = useServer();
  const { setCallback } = useGlobalContext();
  const navigation = useNavigation();
  const formRef = useRef<FormikProps<FormProps>>(null);
  const { roleId, roleTitle } = useLocalSearchParams<{
    roleId: string;
    roleTitle?: string;
  }>();
  const [loading, setLoading] = useState(true);
  const [members, setMembers] = useState<Member[]>([]);

  useLayoutEffect(() => {
    navigation.setOptions({
      header: (props: NativeStackHeaderProps) => (
        <MyHeader
          {...props}
          title={`Edit ${roleTitle || 'Role'}`}
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

  const [initialValues, setInitialValues] = useState<FormProps>({
    roleTitle: '',
    roleColor: colors.primary,
    allowMention: false
  });

  useEffect(() => {
    (async () => {
      const response = await getData(
        `/api/v1/servers/${currentServerId}/roles/${roleId}`
      );
      setInitialValues({
        roleTitle: response.name,
        roleColor: response.color,
        allowMention: response.allow_anyone_mention
      });
      const responseMembers = await getData(
        `/api/v1/servers/${currentServerId}/roles/${roleId}/members`
      );
      setMembers(
        responseMembers.members.map(
          (member: any): Member => ({
            id: member.id,
            username: member.username,
            display_name: member.display_name,
            avatar: member.avatar_url
          })
        )
      );
      setLoading(false);
    })();
  }, []);

  const [deleteModalVisible, setDeleteModalVisible] = useState(false);

  const colorPickerRef = useRef<BottomSheetModal>(null);

  const handleOpenColorPicker = () => {
    colorPickerRef.current?.present();
  };

  const handleCloseColorPicker = () => {
    colorPickerRef.current?.dismiss();
  };

  const [removeMemberId, setRemoveMemberId] = useState<string | null>(null);
  const [removeMemberUsername, setRemoveMemberUsername] = useState<
    string | null
  >(null);
  const removeMemberRef = useRef<BottomSheetModal>(null);

  const handleOpenRemoveMember = () => {
    removeMemberRef.current?.present();
  };

  const handleCloseRemoveMember = () => {
    removeMemberRef.current?.dismiss();
  };

  const handleSubmit = async (
    values: FormProps,
    setErrors: (field: string, message: string | undefined) => void
  ) => {
    try {
      const response = await patchData(
        `/api/v1/servers/${currentServerId}/roles/${roleId}`,
        {
          name: values.roleTitle,
          color: values.roleColor,
          allow_anyone_mention: values.allowMention
        }
      );
      const newRole = {
        id: response.id,
        name: response.name,
        color: response.color,
        allowMention: response.allow_anyone_mention,
        memberCount: members.length
      };
      router.back();
    } catch (e) {
      showAlert('Error');
    }
  };

  const handleDelete = async () => {
    try {
      const response = await deleteData(
        `/api/v1/servers/${currentServerId}/roles/${roleId}`
      );
      const newRoles = roles.filter((role) => role.id !== roleId);
      router.back();
    } catch (e) {
      showAlert('Error');
    }
  };

  return (
    <Formik
      innerRef={formRef}
      initialValues={initialValues}
      enableReinitialize
      onSubmit={(values, { setFieldError }) => {
        handleSubmit(values, setFieldError);
      }}
    >
      {({ values, errors, touched, handleChange, setFieldValue }) => (
        <View
          style={{
            flex: 1,
            backgroundColor: colors.gray04
          }}
        >
          <BasicModal
            visible={deleteModalVisible}
            onClose={() => setDeleteModalVisible(false)}
            title="Delete Role"
            onConfirm={handleDelete}
          >
            <MyText>{`Are you sure you want to delete this role?`}</MyText>
          </BasicModal>
          <MyBottomSheetModal
            ref={colorPickerRef}
            onClose={handleCloseColorPicker}
            heading="Pick a Color"
          >
            <MyColorPicker
              color={values.roleColor}
              handleChange={handleChange('roleColor')}
            />
          </MyBottomSheetModal>
          <MyBottomSheetModal
            ref={removeMemberRef}
            onClose={handleCloseRemoveMember}
            heading={`Remove ${removeMemberUsername}`}
          >
            <ButtonListText
              items={[
                {
                  text: 'Remove',
                  style: {
                    color: colors.semantic_red
                  },
                  onPress: async () => {
                    try {
                      const response = await deleteData(
                        `/api/v1/servers/${currentServerId}/roles/${roleId}/members/${removeMemberId}`
                      );
                      setMembers(
                        members.filter((member) => member.id !== removeMemberId)
                      );
                    } catch (e) {
                      showAlert('Error');
                    }
                    handleCloseRemoveMember();
                  }
                }
              ]}
            />
          </MyBottomSheetModal>
          {loading ? (
            <ActivityIndicator />
          ) : (
            <ScrollView>
              <View style={styles.topContainer}>
                <TouchableOpacity
                  style={styles.roleIcon}
                  onPress={handleOpenColorPicker}
                >
                  <View style={styles.iconWrapper}>
                    <RoleIcon color={values.roleColor} />
                  </View>
                  <IconWithSize
                    icon={ColorizeIcon}
                    size={24}
                    color={colors.gray02}
                  />
                </TouchableOpacity>
                <View style={{ flex: 1 }}>
                  <CustomTextInput
                    title="Role title"
                    placeholder="Add a title"
                    value={values.roleTitle}
                    onChangeText={handleChange('roleTitle')}
                    errorMessage={
                      errors.roleTitle && touched.roleTitle
                        ? errors.roleTitle
                        : undefined
                    }
                  />
                </View>
              </View>
              <View style={styles.botContainer}>
                <ButtonListText
                  items={[
                    {
                      text: 'Permissions',
                      onPress: () => router.navigate('./permissions')
                    }
                  ]}
                />
                <ButtonListToggle
                  items={[
                    {
                      value: 'mention',
                      label: 'Allow role mentions',
                      isOn: values.allowMention,
                      onChange: (isOn) => setFieldValue('allowMention', isOn)
                    }
                  ]}
                />
                <ButtonListText
                  items={[
                    {
                      text: 'Add members',
                      onPress: () => {
                        setCallback(() => (memberIds: string[]) => {
                          (async () => {
                            memberIds.forEach(async (memberId) => {
                              const response = await postData(
                                `/api/v1/servers/${currentServerId}/roles/${roleId}/members/${memberId}`
                              );
                              setMembers(
                                response.members.map((member: any) => ({
                                  id: member.id,
                                  username: member.username,
                                  display_name: member.display_name,
                                  avatar: member.avatar_url
                                }))
                              );
                            });
                          })();
                        });
                        console.log(members);
                        router.navigate({
                          pathname: '/server/add_members',
                          params: {
                            excluded: members.map((member) => member.id)
                          }
                        });
                      }
                    }
                  ]}
                />
                <Accordion heading={`(${members.length}) Members`} defaultOpen>
                  {members.map((member, index) => (
                    <TouchableOpacity
                      key={index}
                      style={styles.memberItem}
                      onPress={() => {
                        setRemoveMemberId(member.id);
                        setRemoveMemberUsername(member.username);
                        handleOpenRemoveMember();
                        console.log(member);
                      }}
                    >
                      <Image
                        source={
                          member.avatar
                            ? { uri: member.avatar }
                            : DefaultProfileImage
                        }
                        style={styles.avatar}
                      />
                      <View style={styles.memberInfo}>
                        <Text style={styles.name}>{member.display_name}</Text>
                        <Text
                          style={styles.username}
                        >{`@${member.username}`}</Text>
                      </View>
                    </TouchableOpacity>
                  ))}
                </Accordion>
                <ButtonListText
                  items={[
                    {
                      text: 'Delete role',
                      style: {
                        color: colors.semantic_red
                      },
                      onPress: () => setDeleteModalVisible(true)
                    }
                  ]}
                />
              </View>
            </ScrollView>
          )}
        </View>
      )}
    </Formik>
  );
};

export default RoleEdit;

const styles = StyleSheet.create({
  headerSave: {
    ...TextStyles.h3,
    color: colors.primary
  },
  topContainer: {
    padding: 16,
    gap: 16,
    flexDirection: 'row',
    width: '100%',
    alignItems: 'center'
  },
  roleIcon: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 64,
    width: 64
  },
  iconWrapper: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center'
  },
  botContainer: {
    padding: 16,
    gap: 16
  },
  memberItem: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    flexDirection: 'row',
    gap: 12
  },
  memberInfo: {
    flexDirection: 'column',
    gap: 4
  },
  name: {
    ...TextStyles.bodyM,
    fontFamily: fonts.bold
  },
  username: {
    ...TextStyles.bodyS,
    color: colors.gray02
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22
  }
});
