import {
  FlatList,
  StyleSheet,
  View,
  TouchableOpacity,
  Alert
} from 'react-native';
import React, { useCallback, useLayoutEffect, useMemo, useRef } from 'react';
import { router, useNavigation } from 'expo-router';
import { NativeStackHeaderProps } from '@react-navigation/native-stack';

import MyHeader from '@/components/MyHeader';
import GlobalStyles from '@/styles/GlobalStyles';
import MyText from '@/components/MyText';
import { colors, fonts } from '@/constants/theme';
import CustomTextInput from '@/components/common/CustomTextInput';
import { Formik, FormikProps } from 'formik';
import useServer from '@/hooks/useServer';

type FormProps = {
  categoryName: string;
};

const CreateCategory = () => {
  const navigation = useNavigation();
  const formRef = useRef<FormikProps<FormProps>>(null);

  const handleSubmit = (
    values: FormProps,
    setErrors: (field: string, message: string | undefined) => void
  ) => {
    console.log(values);
    try {
      // handle create here
    } catch (e) {
      setErrors('categoryName', 'Invalid channel name');
    }
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      header: (props: NativeStackHeaderProps) => (
        <MyHeader
          {...props}
          title="Create Category"
          headerRight={
            <TouchableOpacity
              onPress={() => {
                formRef.current?.submitForm();
              }}
            >
              <MyText style={styles.headerEdit}>Create</MyText>
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

  return (
    <View style={styles.container}>
      <Formik
        innerRef={formRef}
        initialValues={{
          categoryName: ''
        }}
        onSubmit={(values, { setFieldError }) => {
          handleSubmit(values, setFieldError);
        }}
      >
        {({ values, errors, touched, handleChange }) => (
          <CustomTextInput
            title="CATEGORY NAME"
            placeholder="Add a category name"
            value={values.categoryName}
            onChangeText={handleChange('categoryName')}
            errorMessage={
              errors.categoryName && touched.categoryName
                ? errors.categoryName
                : undefined
            }
          />
        )}
      </Formik>
    </View>
  );
};

export default CreateCategory;

const styles = StyleSheet.create({
  container: {
    ...GlobalStyles.container,
    flex: 1,
    paddingVertical: 16
  },
  headerEdit: {
    fontSize: 20,
    fontFamily: fonts.medium,
    color: colors.primary
  }
});
