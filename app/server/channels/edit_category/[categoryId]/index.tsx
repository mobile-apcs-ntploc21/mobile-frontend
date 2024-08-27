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
import CustomTextInput from '@/components/common/CustomTextInput';
import ButtonListText from '@/components/ButtonList/ButtonListText';
import BasicModal from '@/components/modal/BasicModal';

type FormProps = {
  categoryName: string;
};

// required to pass a query param to the screen indicating the name of the category
const EditCategory = () => {
  const navigation = useNavigation();
  const formRef = useRef<FormikProps<FormProps>>(null);

  const { categoryId, categoryName } = useLocalSearchParams<{
    categoryId: string;
    categoryName?: string;
  }>();

  useLayoutEffect(() => {
    navigation.setOptions({
      header: (props: NativeStackHeaderProps) => (
        <MyHeader
          {...props}
          title={`Edit ${categoryName || 'Category'}`}
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

  const handleSubmit = (
    values: FormProps,
    setErrors: (field: string, message: string | undefined) => void
  ) => {
    console.log(values);
    try {
      // handle create here
    } catch (e) {
      // setErrors('categoryName', 'Invalid category name');
    }
  };

  return (
    <Formik
      innerRef={formRef}
      initialValues={{
        categoryName: ''
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
            title="Delete Category"
            onConfirm={() => {
              // deleteData();
            }}
          >
            <MyText>{`Are you sure you want to delete this category?`}</MyText>
          </BasicModal>
          <ScrollView>
            <View style={styles.container}>
              <CustomTextInput
                title="Category name"
                placeholder="Add a category name"
                value={values.categoryName}
                onChangeText={handleChange('categoryName')}
                errorMessage={
                  errors.categoryName && touched.categoryName
                    ? errors.categoryName
                    : undefined
                }
              />
              <ButtonListText
                items={[
                  {
                    text: 'Permissions',
                    onPress: () => {}
                  }
                ]}
              />
              <ButtonListText
                items={[
                  {
                    text: 'Delete category',
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

export default EditCategory;

const styles = StyleSheet.create({
  headerSave: {
    ...TextStyles.h3,
    color: colors.primary
  },
  container: {
    padding: 16,
    gap: 16
  }
});
