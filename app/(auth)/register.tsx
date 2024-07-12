import CustomTextInput from '@/components/common/CustomTextInput';
import GlobalStyles from '@/styles/GlobalStyles';
import AuthStyles from '@/styles/AuthStyles';
import { useAuth } from '@/context/AuthProvider';
import { showAlert } from '@/services/alert';

import {
  GestureResponderEvent,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import React, { useEffect } from 'react';
import { Formik } from 'formik';
import { router, useNavigation } from 'expo-router';
import { CommonActions } from '@react-navigation/native';
import * as Yup from 'yup';

const phoneRegExp =
  /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;

const validationSchema = Yup.object().shape({
  email: Yup.string().email('Email is invalid').required('Email is required'),
  username: Yup.string().required('Username is required'),
  phoneNumber: Yup.string().matches(phoneRegExp, 'Phone number is not valid'),
  password: Yup.string().required('Password is required'),
  confirmPassword: Yup.string().oneOf(
    [Yup.ref('password'), undefined],
    'Passwords must match'
  )
});

const Register = () => {
  const { register } = useAuth();
  const navigation = useNavigation();

  const handleRegister = async (value: any) => {
    try {
      console.log(value);

      await register(
        value.username,
        value.phoneNumber,
        value.email,
        value.password
      );

      navigation.dispatch({
        ...CommonActions.reset({
          index: 0,
          routes: [{ key: '(tabs)', name: '(tabs)' }]
        })
      });
    } catch (e: any) {
      showAlert(e.message);
    }
  };

  return (
    <View style={GlobalStyles.screen}>
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
          onSubmit={(values) => {
            handleRegister(values);
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
                <TouchableOpacity
                  style={AuthStyles.button}
                  onPress={handleSubmit as (e?: GestureResponderEvent) => void}
                >
                  <Text style={AuthStyles.buttonText}>Register</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </Formik>
      </View>
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
