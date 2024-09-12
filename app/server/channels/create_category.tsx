import { NativeStackHeaderProps } from '@react-navigation/native-stack';
import { router, useNavigation } from 'expo-router';
import { useLayoutEffect, useRef } from 'react';
import { Alert, StyleSheet, TouchableOpacity, View } from 'react-native';

import MyHeader from '@/components/MyHeader';
import MyText from '@/components/MyText';
import CustomTextInput from '@/components/common/CustomTextInput';
import { colors, fonts } from '@/constants/theme';
import GlobalStyles from '@/styles/GlobalStyles';
import { Formik, FormikProps } from 'formik';
import useServers from '@/hooks/useServers';
import { postData } from '@/utils/api';
import useServer from '@/hooks/useServer';
import { ServerActions } from '@/context/ServerProvider';

type FormProps = {
  categoryName: string;
};

const CreateCategory = () => {
  const navigation = useNavigation();
  const formRef = useRef<FormikProps<FormProps>>(null);

  const { currentServerId } = useServers();
  const { categories, dispatch } = useServer();

  const handleSubmit = async (
    values: FormProps,
    setErrors: (field: string, message: string | undefined) => void
  ) => {
    if (!values.categoryName) {
      setErrors('categoryName', 'Category name is required');
      return;
    }
    if (values.categoryName.length > 100) {
      setErrors('categoryName', 'Category name is too long');
      return;
    }

    try {
      const requestBody = {
        name: values.categoryName
      };
      const response = (
        await postData(
          `/api/v1/servers/${currentServerId}/categories`,
          requestBody
        )
      ).category;

      console.log(response);

      if (!response) {
        throw new Error('Failed to create category');
      }

      // Add the new category to the list of categories
      const newCategory = [...categories];
      newCategory.push(response);
      dispatch({
        type: ServerActions.CREATE_CATEGORY,
        payload: {
          id: response.id,
          name: response.name,
          position: categories.length,
          channels: []
        }
      });

      router.replace({
        pathname: `./edit_category/${response.id}`,
        params: { categoryName: response.name }
      });
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
