import { Alert, StyleSheet, Text, View } from 'react-native';
import React, { useLayoutEffect, useRef, useState } from 'react';
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

type FormProps = {
  roleTitle: string;
  roleColor: string;
  allowMention: boolean;
};

const RoleEdit = () => {
  const navigation = useNavigation();
  const formRef = useRef<FormikProps<FormProps>>(null);

  const { roleId, roleTitle } = useLocalSearchParams<{
    roleId: string;
    roleTitle?: string;
  }>();

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

  const [deleteModalVisible, setDeleteModalVisible] = useState(false);

  const bottomSheetRef = useRef<BottomSheetModal>(null);

  const handleOpenBottomSheet = () => {
    bottomSheetRef.current?.present();
  };

  const handleCloseBottomSheet = () => {
    bottomSheetRef.current?.dismiss();
  };

  const handleSubmit = (
    values: FormProps,
    setErrors: (field: string, message: string | undefined) => void
  ) => {
    console.log(values);
    try {
      // handle create here
    } catch (e) {
      setErrors('roleTitle', 'Invalid role name');
    }
  };

  return (
    <Formik
      innerRef={formRef}
      initialValues={{
        roleTitle: '',
        roleColor: colors.primary,
        allowMention: false
      }}
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
            onConfirm={() => {
              // deleteData();
            }}
          >
            <MyText>{`Are you sure you want to delete this role?`}</MyText>
          </BasicModal>
          <MyBottomSheetModal
            ref={bottomSheetRef}
            onClose={handleCloseBottomSheet}
            heading="Pick a Color"
          >
            <MyColorPicker
              color={values.roleColor}
              handleChange={handleChange('roleColor')}
            />
          </MyBottomSheetModal>
          <ScrollView>
            <View style={styles.topContainer}>
              <TouchableOpacity
                style={styles.roleIcon}
                onPress={handleOpenBottomSheet}
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
                    onPress: () => {}
                  }
                ]}
              />
              <Accordion heading={`(10) Members`} defaultOpen>
                {Array.from({ length: 10 }, (_, index) => (
                  <View key={index} style={styles.memberItem}>
                    <Avatar id={index.toString()} />
                    <View style={styles.memberInfo}>
                      <Text style={styles.name}>John Doe</Text>
                      <Text style={styles.username}>{`@${'johndoe'}`}</Text>
                    </View>
                  </View>
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
  }
});