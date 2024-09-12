import CustomTextInput from '@/components/common/CustomTextInput';
import { colors, fonts } from '@/constants/theme';
import GlobalStyles from '@/styles/GlobalStyles';
import AuthStyles from '@/styles/AuthStyles';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@/context/AuthProvider';
import { showAlert } from '@/services/alert';

import { Link, router, useNavigation } from 'expo-router';
import { CommonActions } from '@react-navigation/native';
import { useEffect, useState } from 'react';
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
import { Formik, FormikErrors } from 'formik';
import * as Yup from 'yup';
import { MyButtonText } from '@/components/MyButton';

const validationSchema = Yup.object().shape({
  email: Yup.string().email('Email is invalid').required('Email is required'),
  password: Yup.string().required('Password is required')
});

export default function Login() {
  const { login } = useAuth();
  const navigation = useNavigation();

  const handleLogin = async (
    email: string,
    password: string,
    setErrors: (field: string, message: string | undefined) => void
  ) => {
    try {
      await login(email, password);
    } catch (e: any) {
      switch (e.message) {
        case 'Invalid email or password':
          setErrors('email', 'Invalid email or password');
          setErrors('password', 'Invalid email or password');
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
          <Ionicons
            name="chatbubble-ellipses"
            size={120}
            color={colors.primary}
          />
          <View style={AuthStyles.titleContainer}>
            <Text style={AuthStyles.title}>Welcome back to Orantio</Text>
            <Text style={AuthStyles.subtitle}>Log in to continue</Text>
          </View>
          <Formik
            initialValues={{
              email: '',
              password: ''
            }}
            validationSchema={validationSchema}
            onSubmit={(values, { setFieldError }) => {
              try {
                handleLogin(values.email, values.password, setFieldError);
              } catch (e: any) {
                console.log(e);
              }
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
                    placeholder="Email"
                    value={values.email}
                    onChangeText={handleChange('email')}
                    errorMessage={
                      errors.email && touched.email ? errors.email : undefined
                    }
                    keyboardType="email-address"
                  />
                  <CustomTextInput
                    title="Password"
                    placeholder="Password"
                    secureTextEntry
                    value={values.password}
                    onChangeText={handleChange('password')}
                    errorMessage={
                      errors.password && touched.password
                        ? errors.password
                        : undefined
                    }
                  />
                  <Link
                    href="/"
                    style={[
                      styles.forgotPassword,
                      {
                        bottom: errors.password && touched.password ? 0 : -20
                      }
                    ]}
                  >
                    Forgot password?
                  </Link>
                </View>
                <View style={AuthStyles.buttonContainer}>
                  <MyButtonText
                    title="Login"
                    onPress={
                      handleSubmit as (e?: GestureResponderEvent) => void
                    }
                    containerStyle={AuthStyles.button}
                  />
                  <View style={styles.registerContainer}>
                    <Text style={styles.registerText}>
                      Don't have an account?
                    </Text>
                    <Link href="/register" style={styles.registerLink}>
                      Register
                    </Link>
                  </View>
                </View>
              </View>
            )}
          </Formik>
        </View>
      </TouchableWithoutFeedback>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    padding: 16,
    gap: 32
  },
  forgotPassword: {
    fontSize: 12,
    fontFamily: fonts.bold,
    color: colors.black,
    position: 'absolute',
    right: 0
  },
  registerContainer: {
    flexDirection: 'row',
    gap: 4
  },
  registerText: {
    fontSize: 14,
    fontFamily: fonts.regular,
    color: colors.black
  },
  registerLink: {
    fontSize: 14,
    fontFamily: fonts.bold,
    color: colors.primary
  }
});
