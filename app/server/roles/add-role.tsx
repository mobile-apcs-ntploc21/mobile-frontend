import { Alert, StyleSheet, Text, View } from 'react-native';
import React, { useLayoutEffect, useRef } from 'react';
import { NativeStackHeaderProps } from '@react-navigation/native-stack';
import { router, useNavigation } from 'expo-router';
import MyHeader from '@/components/MyHeader';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Formik, FormikProps } from 'formik';
import MyText from '@/components/MyText';
import { TextStyles } from '@/styles/TextStyles';
import { colors } from '@/constants/theme';
import CustomTextInput from '@/components/common/CustomTextInput';
import RoleIcon from '@/assets/icons/RoleIcon';
import IconWithSize from '@/components/IconWithSize';
import ColorizeIcon from '@/assets/icons/ColorizeIcon';
import MyBottomSheetModal from '@/components/modal/MyBottomSheetModal';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import MyColorPicker from '@/components/MyColorPicker';
import useServers from '@/hooks/useServers';
import { Actions } from '@/context/ServersProvider';
import { postData } from '@/utils/api';

type FormProps = {
  roleTitle: string;
  roleColor: string;
};

const AddRole = () => {
  const { roles, dispatch, currentServerId } = useServers();
  const navigation = useNavigation();
  const formRef = useRef<FormikProps<FormProps>>(null);

  useLayoutEffect(() => {
    navigation.setOptions({
      header: (props: NativeStackHeaderProps) => (
        <MyHeader
          {...props}
          title="Create Role"
          headerRight={
            <TouchableOpacity
              onPress={async () => {
                if (formRef.current?.isSubmitting) return;
                await formRef.current?.submitForm();
                formRef.current?.setSubmitting(false);
              }}
            >
              <MyText style={styles.headerCreate}>Create</MyText>
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

  const bottomSheetRef = useRef<BottomSheetModal>(null);

  const handleOpenBottomSheet = () => {
    bottomSheetRef.current?.present();
  };

  const handleCloseBottomSheet = () => {
    bottomSheetRef.current?.dismiss();
  };

  const handleSubmit = async (
    values: FormProps,
    setErrors: (field: string, message: string | undefined) => void
  ) => {
    try {
      const response = await postData(
        `/api/v1/servers/${currentServerId}/roles`,
        {
          name: values.roleTitle,
          color: values.roleColor
        }
      );
      dispatch({
        type: Actions.SET_ROLES,
        payload: [
          ...roles,
          {
            id: response.id,
            name: response.name,
            color: response.color
          }
        ]
      });
      router.replace({
        pathname: `./${response.id}`,
        params: {
          roleTitle: response.name
        }
      });
    } catch (e) {
      setErrors('roleTitle', 'Invalid role name');
    }
  };

  return (
    <Formik
      innerRef={formRef}
      initialValues={{
        roleTitle: '',
        roleColor: colors.primary
      }}
      onSubmit={(values, { setFieldError }) => {
        handleSubmit(values, setFieldError);
      }}
    >
      {({ values, errors, touched, handleChange }) => (
        <View style={{ flex: 1, backgroundColor: colors.gray04 }}>
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

          <View style={styles.container}>
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
        </View>
      )}
    </Formik>
  );
};

export default AddRole;

const styles = StyleSheet.create({
  headerCreate: {
    ...TextStyles.h3,
    color: colors.primary
  },
  container: {
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
  }
});
