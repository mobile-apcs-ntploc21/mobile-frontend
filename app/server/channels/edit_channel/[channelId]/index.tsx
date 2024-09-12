import ButtonListText from '@/components/ButtonList/ButtonListText';
import MyHeader from '@/components/MyHeader';
import MyText from '@/components/MyText';
import CustomTextInput from '@/components/common/CustomTextInput';
import BasicModal from '@/components/modal/BasicModal';
import { colors } from '@/constants/theme';
import { ServerActions } from '@/context/ServerProvider';
import useServer from '@/hooks/useServer';
import useServers from '@/hooks/useServers';
import { TextStyles } from '@/styles/TextStyles';
import { deleteData, patchData } from '@/utils/api';
import { NativeStackHeaderProps } from '@react-navigation/native-stack';
import { router, useLocalSearchParams, useNavigation } from 'expo-router';
import { Formik, FormikProps } from 'formik';
import { useLayoutEffect, useRef, useState } from 'react';
import { Alert, StyleSheet, View } from 'react-native';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';

type FormProps = {
  channelName: string;
  channelTopic: string;
};

// required to pass a query param to the screen indicating the name of the channel
const EditChannel = () => {
  const navigation = useNavigation();
  const formRef = useRef<FormikProps<FormProps>>(null);

  const { currentServerId } = useServers();
  const { categories, dispatch } = useServer();
  const { channelId, channelName, description } = useLocalSearchParams<{
    channelId: string;
    channelName?: string;
    description?: string;
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

  /**
   * Handles the deletion of the channel
   */
  const handleDelete = async () => {
    try {
      const response = await deleteData(
        `/api/v1/servers/${currentServerId}/channels/${channelId}`
      );

      if (!response) {
        throw new Error('Failed to delete channel');
      }

      // Remove the channel
      const newCategories = [...categories];
      for (let i = 0; i < newCategories.length; i++) {
        const channelIndex = newCategories[i].channels.findIndex(
          (channel) => channel.id === channelId
        );
        if (channelIndex !== -1) {
          newCategories[i].channels.splice(channelIndex, 1);
          break;
        }
      }
      dispatch({ type: ServerActions.UPDATE_CHANNEL, payload: newCategories });

      // Navigate back
      router.back();
    } catch (e: any) {
      console.log(e);
    }
  };

  /**
   * Handles the form submission
   */
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
    if (values.channelTopic.length > 1024) {
      setErrors('channelTopic', 'Channel topic is too long');
      return;
    }

    try {
      const requestBody = {
        name: values.channelName,
        description: values.channelTopic
      };
      const response = await patchData(
        `/api/v1/servers/${currentServerId}/channels/${channelId}`,
        requestBody
      );

      if (!response) {
        throw new Error('Failed to update channel');
      }

      // Set new channels data
      const newCategories = [...categories];
      for (let i = 0; i < newCategories.length; i++) {
        const channelIndex = newCategories[i].channels.findIndex(
          (channel) => channel.id === channelId
        );
        if (channelIndex !== -1) {
          newCategories[i].channels[channelIndex] = {
            ...newCategories[i].channels[channelIndex],
            name: values.channelName,
            description: values.channelTopic
          };
          break;
        }
      }

      dispatch({ type: ServerActions.UPDATE_CHANNEL, payload: newCategories });

      router.back();
    } catch (e: any) {
      // setErrors('channelName', 'Invalid channel name');
      console.log(e);
      throw new Error(e.message);
    }
  };

  return (
    <Formik
      innerRef={formRef}
      initialValues={{
        channelName: channelName || 'Channel Name',
        channelTopic: description || ''
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
            onConfirm={handleDelete}
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
                multiline
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
                    onPress: () => router.navigate('./permissions')
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
