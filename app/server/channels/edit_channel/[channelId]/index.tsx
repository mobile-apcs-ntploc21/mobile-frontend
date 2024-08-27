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
  channelName: string;
  channelTopic: string;
};

// required to pass a query param to the screen indicating the name of the channel
const EditChannel = () => {
  const navigation = useNavigation();
  const formRef = useRef<FormikProps<FormProps>>(null);

  const { channelId, channelName } = useLocalSearchParams<{
    channelId: string;
    channelName?: string;
  }>();

  useLayoutEffect(() => {
    navigation.setOptions({
      header: (props: NativeStackHeaderProps) => (
        <MyHeader
          {...props}
          title={`Edit ${channelName || 'Channel'}`}
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
      // setErrors('channelName', 'Invalid channel name');
    }
  };

  return (
    <Formik
      innerRef={formRef}
      initialValues={{
        channelName: '',
        channelTopic: ''
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
            title="Delete Channel"
            onConfirm={() => {
              // deleteData();
            }}
          >
            <MyText>{`Are you sure you want to delete this channel?`}</MyText>
          </BasicModal>
          <ScrollView>
            <View style={styles.container}>
              <CustomTextInput
                title="Channel name"
                placeholder="Add a channel name"
                value={values.channelName}
                onChangeText={handleChange('channelName')}
                errorMessage={
                  errors.channelName && touched.channelName
                    ? errors.channelName
                    : undefined
                }
              />
              <CustomTextInput
                title="Channel topic"
                placeholder="Add a channel topic"
                value={values.channelTopic}
                onChangeText={handleChange('channelTopic')}
                errorMessage={
                  errors.channelTopic && touched.channelTopic
                    ? errors.channelTopic
                    : undefined
                }
              />
              <ButtonListText
                items={[
                  {
                    text: 'Move to another category',
                    onPress: () => router.navigate('./move')
                  }
                ]}
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
                    text: 'Notifications',
                    onPress: () => {}
                  }
                ]}
              />
              <ButtonListText
                items={[
                  {
                    text: 'Delete channel',
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

export default EditChannel;

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
