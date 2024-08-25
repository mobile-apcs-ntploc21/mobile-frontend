import { Alert, StyleSheet, Text, View } from 'react-native';
import React, { useLayoutEffect, useRef } from 'react';
import { NativeStackHeaderProps } from '@react-navigation/native-stack';
import { useNavigation } from 'expo-router';
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
import ColorPicker, {
  HueCircular,
  Panel1,
  returnedResults
} from 'reanimated-color-picker';

type FormProps = {
  roleTitle: string;
  roleColor: string;
};

const AddRole = () => {
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
            <ColorPicker
              value={values.roleColor}
              sliderThickness={20}
              thumbSize={24}
              onComplete={(color: returnedResults) =>
                handleChange('roleColor')(color.hex)
              }
            >
              <HueCircular
                style={styles.hueStyle}
                containerStyle={styles.hueContainer}
                thumbShape="pill"
              >
                <Panel1 style={styles.panelStyle} />
              </HueCircular>
            </ColorPicker>
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
  },
  hueContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.gray03
  },
  hueStyle: {
    width: 320,
    height: 320
  },
  panelStyle: {
    width: '70%',
    height: '70%',
    borderRadius: 16
  }
});
