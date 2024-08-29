import {
  GestureResponderEvent,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import React, { useLayoutEffect } from 'react';
import { router, useNavigation } from 'expo-router';
import { NativeStackHeaderProps } from '@react-navigation/native-stack';
import MyHeader from '@/components/MyHeader';
import { useFormik } from 'formik';
import MyText from '@/components/MyText';
import { TextStyles } from '@/styles/TextStyles';
import { colors } from '@/constants/theme';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import GlobalStyles from '@/styles/GlobalStyles';
import { DefaultCoverImage, DefaultProfileImage } from '@/constants/images';
import { MaterialIcons } from '@expo/vector-icons';
import CustomTextInput from '@/components/common/CustomTextInput';
import { MyButtonText } from '@/components/MyButton';
import { patchData, postData } from '@/utils/api';
import useServers from '@/hooks/useServers';

const uriToBase64WithPrefix = async (uri: string) => {
  const base64 = await FileSystem.readAsStringAsync(uri, {
    encoding: 'base64'
  });
  const ext = uri.split('.').pop();
  return `data:image/${ext};base64,${base64}`;
};

const Overview = () => {
  const navigation = useNavigation();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const { servers, currentServerId } = useServers();

  const formik = useFormik({
    initialValues: {
      serverName: '',
      avatarImageUri: '',
      bannerImageUri: ''
    },

    onSubmit: async (values) => {
      if (isSubmitting) return;

      setIsSubmitting(true);
      const avatar = values.avatarImageUri?.startsWith('file://')
        ? await uriToBase64WithPrefix(values.avatarImageUri)
        : null;
      const banner = values.bannerImageUri?.startsWith('file://')
        ? await uriToBase64WithPrefix(values.bannerImageUri)
        : null;

      const currentServer = servers.find(
        (server) => server.id === currentServerId
      );
      const serverID = currentServer?._id;
      const response = patchData(`/api/v1/servers/${serverID}`, {
        name: values.serverName,
        ...(avatar && { avatar }),
        ...(banner && { banner })
      });

      setIsSubmitting(false);
      router.back();
    }
  });

  useLayoutEffect(() => {
    const currentServer = servers.find(
      (server) => server.id === currentServerId
    );
    if (!currentServer) {
      throw new Error('Server not found');
    }

    // Fetch user data
    formik.setFieldValue('serverName', currentServer.name);
  }, []);

  useLayoutEffect(() => {
    navigation.setOptions({
      header: (props: NativeStackHeaderProps) => (
        <MyHeader
          {...props}
          title="Overview "
          headerRight={
            <TouchableOpacity
              onPress={
                formik.handleSubmit as (e?: GestureResponderEvent) => void
              }
            >
              <MyText style={styles.saveButton}>Save</MyText>
            </TouchableOpacity>
          }
        />
      )
    });
  }, []);

  const pickImageAsync = async (type: 'avatarImageUri' | 'bannerImageUri') => {
    let result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      quality: 1
    });

    if (!result.canceled) {
      formik.setFieldValue(type, result.assets[0].uri);
    } else {
      // alert('You did not select any image.');
    }
  };

  const handlePickAvatarImage = async () => {
    await pickImageAsync('avatarImageUri');
  };

  const handlePickBannerImage = async () => {
    await pickImageAsync('bannerImageUri');
  };

  return (
    <View style={GlobalStyles.screen}>
      <View style={styles.contentContainer}>
        <View style={styles.editContainer}>
          <TouchableOpacity onPress={handlePickBannerImage}>
            <Image
              source={
                formik.values.bannerImageUri
                  ? { uri: formik.values.bannerImageUri }
                  : DefaultCoverImage
              }
              style={styles.bannerImage}
            />
            <View style={GlobalStyles.darkOverlay} />
            <MaterialIcons
              name="edit"
              size={48}
              color={colors.white}
              style={styles.editBannerImage}
            />
          </TouchableOpacity>
          <View style={styles.fieldContainer}>
            <TouchableOpacity
              onPress={handlePickAvatarImage}
              style={styles.avatarImageContainer}
            >
              <Image
                source={
                  formik.values.avatarImageUri
                    ? { uri: formik.values.avatarImageUri }
                    : DefaultCoverImage
                }
                style={styles.avatarImage}
              />
              <View style={GlobalStyles.darkOverlay} />
              <MaterialIcons
                name="edit"
                size={16}
                color={colors.white}
                style={styles.editAvatarImage}
              />
            </TouchableOpacity>
            <View style={{ flex: 1 }}>
              <CustomTextInput
                title="Server Name"
                placeholder="Add a server name"
                value={formik.values.serverName}
                onChangeText={formik.handleChange('serverName')}
              />
            </View>
          </View>
        </View>
        <View style={styles.deleteButtonContainer}>
          <MyButtonText
            title="Delete Server"
            onPress={() => console.log('Delete server')}
            backgroundColor={colors.semantic_red}
            textColor={colors.white}
            containerStyle={styles.deleteButton}
            reverseStyle
          />
        </View>
      </View>
    </View>
  );
};

export default Overview;

const styles = StyleSheet.create({
  saveButton: {
    ...TextStyles.h3,
    color: colors.primary
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'space-between'
  },
  editContainer: {
    width: '100%'
  },
  bannerImage: {
    width: '100%',
    height: 168
  },
  editBannerImage: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -24 }, { translateY: -24 }]
  },
  fieldContainer: {
    padding: 16,
    gap: 16,
    flexDirection: 'row',
    alignItems: 'center'
  },
  avatarImageContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    overflow: 'hidden'
  },
  avatarImage: {
    width: 64,
    height: 64
  },
  editAvatarImage: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -8 }, { translateY: -8 }]
  },
  deleteButtonContainer: {
    width: '100%',
    padding: 16
  },
  deleteButton: {
    width: '100%'
  }
});
