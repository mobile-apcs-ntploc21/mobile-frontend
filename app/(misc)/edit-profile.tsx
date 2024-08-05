import {
  GestureResponderEvent,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import React, { useEffect, useLayoutEffect } from 'react';
import { useFormik } from 'formik';
import { router, useNavigation } from 'expo-router';
import CustomTextInput from '@/components/common/CustomTextInput';
import MyHeader from '@/components/MyHeader';
import { NativeStackHeaderProps } from '@react-navigation/native-stack';
import MyText from '@/components/MyText';
import { TextStyles } from '@/styles/TextStyles';
import { colors } from '@/constants/theme';
import Toggle from '@/components/Toggle';
import { DefaultCoverImage, DefaultProfileImage } from '@/constants/images';
import GlobalStyles from '@/styles/GlobalStyles';
import { MaterialIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useUserContext } from '@/context/UserProvider';
import { patchData } from '@/utils/api';
import * as FileSystem from 'expo-file-system';

const uriToBase64WithPrefix = async (uri: string) => {
  const base64 = await FileSystem.readAsStringAsync(uri, {
    encoding: 'base64'
  });
  const ext = uri.split('.').pop();
  return `data:image/${ext};base64,${base64}`;
};

const EditProfile = () => {
  const { data: userData } = useUserContext();
  const navigation = useNavigation();

  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const formik = useFormik({
    initialValues: {
      displayName: '',
      aboutMe: '',
      profileImageUri: '',
      coverImageUri: ''
    },
    onSubmit: async (values) => {
      if (isSubmitting) return;
      setIsSubmitting(true);
      try {
        const avatar = values.profileImageUri?.startsWith('file://')
          ? await uriToBase64WithPrefix(values.profileImageUri)
          : null;
        const banner = values.coverImageUri?.startsWith('file://')
          ? await uriToBase64WithPrefix(values.coverImageUri)
          : null;

        await patchData('/api/v1/profile', {
          display_name: values.displayName,
          about_me: values.aboutMe,
          ...(avatar && { avatar }),
          ...(banner && { banner })
        });
        router.back();
      } catch (e) {
      } finally {
        setIsSubmitting(false);
      }
    }
  });

  useLayoutEffect(() => {
    // Fetch user data
    formik.setFieldValue('displayName', userData.display_name);
    formik.setFieldValue('aboutMe', userData.about_me);
    formik.setFieldValue('profileImageUri', userData.avatar_url);
    formik.setFieldValue('coverImageUri', userData.banner_url);
  }, []);

  useLayoutEffect(() => {
    navigation.setOptions({
      header: (props: NativeStackHeaderProps) => (
        <MyHeader
          {...props}
          title="Edit Profile"
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

  const pickImageAsync = async (type: 'profileImageUri' | 'coverImageUri') => {
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

  const handlePickProfileImage = async () => {
    await pickImageAsync('profileImageUri');
  };

  const handlePickCoverImage = async () => {
    await pickImageAsync('coverImageUri');
  };

  return (
    <View style={GlobalStyles.screen}>
      <View style={styles.toggleContainer}>
        <Toggle
          FirstFC={({ isSelected }) => (
            <MyText
              style={{
                ...TextStyles.h5,
                color: isSelected ? colors.black : colors.gray02
              }}
            >
              User Profile
            </MyText>
          )}
          SecondFC={({ isSelected }) => (
            <MyText
              style={{
                ...TextStyles.h5,
                color: isSelected ? colors.black : colors.gray02
              }}
            >
              Server Profile
            </MyText>
          )}
          backgroundColor={colors.gray03}
        />
      </View>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <TouchableOpacity onPress={handlePickCoverImage}>
          <Image
            source={
              formik.values.coverImageUri
                ? { uri: formik.values.coverImageUri }
                : DefaultCoverImage
            }
            style={styles.coverImage}
          />
          <View style={GlobalStyles.darkOverlay} />
          <MaterialIcons
            name="edit"
            size={48}
            color={colors.white}
            style={styles.editCoverImage}
          />
        </TouchableOpacity>
        <View style={styles.profileContainer}>
          <View style={styles.profileImageContainer}>
            <TouchableOpacity onPress={handlePickProfileImage}>
              <Image
                source={
                  formik.values.profileImageUri
                    ? { uri: formik.values.profileImageUri }
                    : DefaultProfileImage
                }
                style={styles.profileImage}
              />
              <View style={GlobalStyles.darkOverlay} />
              <MaterialIcons
                name="edit"
                size={32}
                color={colors.white}
                style={styles.editProfileImage}
              />
            </TouchableOpacity>
          </View>
          <View style={styles.textInputContainer}>
            <CustomTextInput
              title="Display Name"
              placeholder={userData.username}
              value={formik.values.displayName}
              onChangeText={formik.handleChange('displayName')}
            />
            <CustomTextInput
              title="About Me"
              placeholder="Lorem ipsum"
              value={formik.values.aboutMe}
              onChangeText={formik.handleChange('aboutMe')}
            />
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default EditProfile;

const styles = StyleSheet.create({
  saveButton: {
    ...TextStyles.h3,
    color: colors.primary
  },
  toggleContainer: {
    width: '100%',
    paddingVertical: 16,
    alignItems: 'center',
    backgroundColor: colors.gray04
  },
  coverImage: {
    width: '100%',
    height: 168
  },
  profileContainer: {
    width: '100%',
    marginTop: -30,
    flex: 1,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    backgroundColor: colors.gray04,
    // backgroundColor: 'red',
    paddingHorizontal: 16,
    paddingBottom: 16,
    gap: 16
  },
  profileImageContainer: {
    width: 128,
    height: 128,
    position: 'absolute',
    left: 32,
    top: -64,
    borderRadius: 64,
    backgroundColor: colors.gray04,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 4,
    borderColor: colors.gray04,
    overflow: 'hidden'
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60
  },
  textInputContainer: {
    marginTop: 64,
    gap: 8
  },
  editCoverImage: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -24 }, { translateY: -24 }]
  },
  editProfileImage: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -16 }, { translateY: -16 }]
  }
});
