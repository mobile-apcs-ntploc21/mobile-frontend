import CustomTextInput from '@/components/common/CustomTextInput';
import GlobalStyles from '@/styles/GlobalStyles';
import AuthStyles from '@/styles/AuthStyles';
import { useAuth } from '@/context/AuthProvider';
import { showAlert, useNotification } from '@/services/alert';

import {
  GestureResponderEvent,
  Keyboard,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View
} from 'react-native';
import React, { useEffect } from 'react';
import { Formik } from 'formik';
import { router, useNavigation } from 'expo-router';
import { CommonActions } from '@react-navigation/native';
import * as Yup from 'yup';
import { MyButtonText } from '@/components/MyButton';

const phoneRegExp =
  /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;

const passwordRegExp = /^(?=.*\d)(?=.*[a-zA-Z]).{8,}$/;

const validationSchema = Yup.object().shape({
  email: Yup.string().email('Email is invalid').required('Email is required'),
  username: Yup.string().required('Username is required'),
  phoneNumber: Yup.string().matches(phoneRegExp, 'Phone number is not valid'),
  password: Yup.string()
    .required('Password is required')
    .matches(
      passwordRegExp,
      'Password must contain at least 8 characters, one letter and one number'
    ),
  confirmPassword: Yup.string().oneOf(
    [Yup.ref('password'), undefined],
    'Passwords must match'
  )
});

const Register = () => {
  const { register } = useAuth();
  const navigation = useNavigation();
  const { showAlert } = useNotification();

  const handleRegister = async (
    value: any,
    setFieldError: (field: string, message: string | undefined) => void
  ) => {
    try {
      console.log(value);

      await register(
        value.username,
        value.phoneNumber,
        value.email,
        value.password
      );
    } catch (e: any) {
      switch (e.message) {
        case 'Email already exists':
          setFieldError('email', 'Email already exists');
          break;
        case 'Username already exists':
          setFieldError('username', 'Username already exists');
          break;
        default:
          showAlert(e.message);
          break;
      }
    }
  };

  return (
    <View style={GlobalStyles.screen}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <View style={styles.container}>
          <View style={AuthStyles.titleContainer}>
            <Text style={AuthStyles.title}>Let's get you started!</Text>
            <Text style={AuthStyles.subtitle}>Create an account</Text>
          </View>
          <Formik
            initialValues={{
              email: '',
              username: '',
              phoneNumber: '',
              password: '',
              confirmPassword: ''
            }}
            validationSchema={validationSchema}
            onSubmit={(values, { setFieldError }) => {
              handleRegister(values, setFieldError);
            }}
          >
            {({
              handleChange,
              handleSubmit,
              handleBlur,
              values,
              errors,
              touched
            }) => (
              <View style={AuthStyles.contentContainer}>
                <View style={AuthStyles.fieldContainer}>
                  <CustomTextInput
                    title="Email"
                    placeholder="Email*"
                    value={values.email}
                    onChangeText={handleChange('email')}
                    errorMessage={
                      errors.email && touched.email ? errors.email : undefined
                    }
                    keyboardType="email-address"
                  />
                  <CustomTextInput
                    title="Username"
                    placeholder="Username*"
                    value={values.username}
                    onChangeText={handleChange('username')}
                    errorMessage={
                      errors.username && touched.username
                        ? errors.username
                        : undefined
                    }
                  />
                  <CustomTextInput
                    title="Phone Number"
                    placeholder="Phone Number"
                    value={values.phoneNumber}
                    onChangeText={handleChange('phoneNumber')}
                    errorMessage={
                      errors.phoneNumber && touched.phoneNumber
                        ? errors.phoneNumber
                        : undefined
                    }
                    keyboardType="phone-pad"
                  />

                  <CustomTextInput
                    title="Password"
                    placeholder="Password*"
                    secureTextEntry
                    value={values.password}
                    onChangeText={handleChange('password')}
                    errorMessage={
                      errors.password && touched.password
                        ? errors.password
                        : undefined
                    }
                  />
                  <CustomTextInput
                    title="Confirm Password"
                    placeholder="Confirm Password*"
                    secureTextEntry
                    value={values.confirmPassword}
                    onChangeText={handleChange('confirmPassword')}
                    errorMessage={
                      errors.confirmPassword && touched.confirmPassword
                        ? errors.confirmPassword
                        : undefined
                    }
                  />
                </View>
                <View style={AuthStyles.buttonContainer}>
                  <MyButtonText
                    title="Register"
                    onPress={
                      handleSubmit as (e?: GestureResponderEvent) => void
                    }
                    containerStyle={AuthStyles.button}
                  />
                </View>
              </View>
            )}
          </Formik>
        </View>
      </TouchableWithoutFeedback>
    </View>
  );
};

export default Register;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 32,
    padding: 16
  }
});
