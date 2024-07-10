import {
  GestureResponderEvent,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import React, { useEffect } from 'react';
import GlobalStyles from '@/styles/GlobalStyles';
import AuthStyles from '@/styles/AuthStyles';
import { Formik } from 'formik';
import CustomTextInput from '@/components/common/CustomTextInput';
import { router, useNavigation } from 'expo-router';
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
  const navigation = useNavigation();

  return (
    <View style={GlobalStyles.screen}>
      <View style={styles.container}>
        <View style={AuthStyles.titleContainer}>
          <Text style={AuthStyles.title}>Welcome back to Orantio</Text>
          <Text style={AuthStyles.subtitle}>Log in to continue</Text>
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
            console.log(values);
            // router.push('/servers');
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
