import { MyButtonText } from '@/components/MyButton';
import MyHeader from '@/components/MyHeader';
import MyText from '@/components/MyText';
import CustomTextInput from '@/components/common/CustomTextInput';
import DeleteServerModal from '@/components/modal/DeleteServerModal';
import { DefaultCoverImage } from '@/constants/images';
import { colors } from '@/constants/theme';
import { useUserContext } from '@/context/UserProvider';
import useServers from '@/hooks/useServers';
import { showAlert } from '@/services/alert';
import GlobalStyles from '@/styles/GlobalStyles';
import { TextStyles } from '@/styles/TextStyles';
import { deleteData, patchData } from '@/utils/api';
import { MaterialIcons } from '@expo/vector-icons';
import { NativeStackHeaderProps } from '@react-navigation/native-stack';
import * as FileSystem from 'expo-file-system';
import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import { router, useNavigation } from 'expo-router';
import { useFormik } from 'formik';
import React, { useLayoutEffect, useMemo } from 'react';
import {
  GestureResponderEvent,
  StyleSheet,
  TouchableOpacity,
  View
} from 'react-native';

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
  const [showDeleteModal, setShowDeleteModal] = React.useState(false);
  const { servers, currentServerId, setServers, selectServer } = useServers();
  const { data } = useUserContext();

  const thisServer = useMemo(
    () => servers.find((server) => server.id === currentServerId),
    [servers, currentServerId]
  );

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

      console.log('avatar', avatar ? avatar.slice(0, 100) : false);
      console.log('banner', banner ? banner.slice(0, 100) : false);

      const serverID = thisServer?.id;
      const response = patchData(`/api/v1/servers/${serverID}`, {
        name: values.serverName,
        avatar: avatar,
        banner: banner
      });

      // Set new server data
      const newServers = [...servers];
      const index = newServers.findIndex(
        (server) => server.id === currentServerId
      );

      newServers[index] = {
        ...newServers[index],
        name: values.serverName,
        avatar: values.avatarImageUri,
        banner: values.bannerImageUri
      };
      setServers(newServers, true);

      setIsSubmitting(false);
      router.back();
    }
  });

  useLayoutEffect(() => {
    // Fetch user data
    formik.setFieldValue('serverName', thisServer?.name || '');
    formik.setFieldValue('avatarImageUri', thisServer?.avatar || '');
    formik.setFieldValue('bannerImageUri', thisServer?.banner || '');
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
      <DeleteServerModal
        currentServer={thisServer}
        visible={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
      />
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
        {thisServer?.owner_id === data?.user_id && (
          <View style={styles.deleteButtonContainer}>
            <MyButtonText
              title="Delete Server"
              onPress={() => {
                setShowDeleteModal(true);
                console.log('delete server');
              }}
              backgroundColor={colors.semantic_red}
              textColor={colors.white}
              containerStyle={styles.deleteButton}
              reverseStyle
            />
          </View>
        )}
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
