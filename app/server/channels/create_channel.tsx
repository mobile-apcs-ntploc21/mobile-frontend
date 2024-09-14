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
import useServer from '@/hooks/useServer';
import { postData } from '@/utils/api';
import { ServerActions } from '@/context/ServerProvider';

type FormProps = {
  channelName: string;
};

const CreateChannel = () => {
  const navigation = useNavigation();
  const formRef = useRef<FormikProps<FormProps>>(null);

  const { currentServerId } = useServers();
  const { categories, dispatch } = useServer();

  const handleSubmit = async (
    values: FormProps,
    setErrors: (field: string, message: string | undefined) => void
  ) => {
    if (!values.channelName) {
      setErrors('channelName', 'Channel name is required');
      return;
    }
    if (values.channelName.length > 100) {
      setErrors('channelName', 'Channel name is too long');
      return;
    }

    try {
      const requestBody = {
        name: values.channelName
      };
      const response = await postData(
        `/api/v1/servers/${currentServerId}/channels`,
        requestBody
      );
      if (!response) {
        throw new Error('Failed to create channel');
      }

      // // Add the new channel to the list of channels
      // dispatch({
      //   type: ServerActions.CREATE_CHANNEL,
      //   payload: {
      //     category_id: null,
      //     id: response.id,
      //     name: response.name,
      //     description: response.description,
      //     position: categories[0].channels.length
      //   }
      // });

      router.replace({
        pathname: `./edit_channel/${response.id}`,
        params: { channelName: response.name }
      });
    } catch (e) {
      setErrors('channelName', 'Invalid channel name');
    }
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      header: (props: NativeStackHeaderProps) => (
        <MyHeader
          {...props}
          title="Create Channel"
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
          channelName: ''
        }}
        onSubmit={(values, { setFieldError }) => {
          handleSubmit(values, setFieldError);
        }}
      >
        {({ values, errors, touched, handleChange }) => (
          <CustomTextInput
            title="CHANNEL NAME"
            placeholder="Add a channel name"
            value={values.channelName}
            onChangeText={handleChange('channelName')}
            errorMessage={
              errors.channelName && touched.channelName
                ? errors.channelName
                : undefined
            }
          />
        )}
      </Formik>
    </View>
  );
};

export default CreateChannel;

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
