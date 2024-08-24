import {
  Image,
  StyleSheet,
  Text,
  Touchable,
  TouchableOpacity,
  View
} from 'react-native';
import React, { useRef } from 'react';
import GlobalStyles from '@/styles/GlobalStyles';
import { DefaultCoverImage, DefaultProfileImage } from '@/constants/images';
import { colors, fonts } from '@/constants/theme';
import StatusBubble from '@/components/StatusBubble';
import MyButtonTextIcon from '@/components/MyButton/MyButtonTextIcon';
import EditStatusIcon from '@/assets/icons/EditStatusIcon';
import EditProfileIcon from '@/assets/icons/EditProfileIcon';
import { TextStyles } from '@/styles/TextStyles';
import MyButtonIcon from '@/components/MyButton/MyButtonIcon';
import SettingIcon from '@/assets/icons/SettingIcon';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import MyBottomSheetModal from '@/components/modal/MyBottomSheetModal';
import { router } from 'expo-router';
import { useUserContext } from '@/context/UserProvider';
import { getOnlineStatusColor } from '@/utils/user';
import ButtonListBase from '@/components/ButtonList/ButtonListBase';
import { StatusType } from '@/types/user_status';
import MyText from '@/components/MyText';
import { postData } from '@/utils/api';

const OnlineStatusItem = (type: StatusType, onClose: () => void) => {
  let onlineStatusText: string;
  switch (type) {
    case StatusType.ONLINE:
      onlineStatusText = 'Online';
      break;
    case StatusType.IDLE:
      onlineStatusText = 'Idle';
      break;
    case StatusType.DO_NOT_DISTURB:
      onlineStatusText = 'Do Not Disturb';
      break;
    case StatusType.INVISIBLE:
      onlineStatusText = 'Invisible';
      break;
    default:
      // Should not happen
      onlineStatusText = 'Offline';
      break;
  }

  return {
    itemComponent: (
      <View style={styles.onlineStatusItem}>
        <View
          style={[
            styles.onlineStatusCircle,
            { backgroundColor: getOnlineStatusColor(type) }
          ]}
        />
        <MyText style={TextStyles.bodyXL}>{onlineStatusText}</MyText>
      </View>
    ),
    onPress: async () => {
      postData('/api/v1/status/type', {
        type
      });
      onClose();
    }
  };
};

const User = () => {
  const bottomSheetRef = useRef<BottomSheetModal>(null);

  const handleOpenBottomSheet = () => {
    bottomSheetRef.current?.present();
  };

  const handleCloseBottomSheet = () => {
    bottomSheetRef.current?.dismiss();
  };

  // User data ---------------------------------------------------------------
  const { data: userData, loading } = useUserContext();

  // console.log(userData, loading);

  return (
    <View style={GlobalStyles.screen}>
      <MyBottomSheetModal
        ref={bottomSheetRef}
        onClose={handleCloseBottomSheet}
        heading="Change Online Status"
      >
        <ButtonListBase
          heading="Online Status"
          items={[
            OnlineStatusItem(StatusType.ONLINE, handleCloseBottomSheet),
            OnlineStatusItem(StatusType.IDLE, handleCloseBottomSheet),
            OnlineStatusItem(StatusType.DO_NOT_DISTURB, handleCloseBottomSheet),
            OnlineStatusItem(StatusType.INVISIBLE, handleCloseBottomSheet)
          ]}
        />
      </MyBottomSheetModal>
      <Image
        source={
          userData?.banner_url
            ? { uri: userData.banner_url }
            : DefaultCoverImage
        }
        style={styles.coverImage}
      />
      <MyButtonIcon
        icon={SettingIcon}
        onPress={() => {}}
        containerStyle={styles.settingsButton}
        textColor={colors.white}
      />
      <View style={styles.profileContainer}>
        <View style={styles.profileImageContainer}>
          {/* TODO: Open onine status selection list */}
          <TouchableOpacity onPress={handleOpenBottomSheet}>
            <Image
              source={
                userData?.avatar_url
                  ? { uri: userData.avatar_url }
                  : DefaultProfileImage
              }
              style={styles.profileImage}
            />
            <View
              style={[
                styles.statusButton,
                {
                  backgroundColor: getOnlineStatusColor(
                    userData?.onlineStatus?.type
                  )
                }
              ]}
            />
          </TouchableOpacity>
        </View>
        <View style={styles.nameContainer}>
          <Text style={styles.displayName}>{userData?.display_name}</Text>
          <Text style={styles.username}>{`@${userData?.username}`}</Text>
        </View>
        {userData?.onlineStatus?.status_text && (
          <StatusBubble
            // emoji="👋"
            text={userData?.onlineStatus?.status_text}
          />
        )}

        <View style={styles.buttonContainer}>
          <MyButtonTextIcon
            title="Edit Status"
            onPress={() => router.navigate('edit-status')}
            iconAfter={EditStatusIcon}
            containerStyle={styles.button}
            textStyle={TextStyles.h4}
          />
          <MyButtonTextIcon
            title="Edit Profile"
            onPress={() => router.navigate('edit-profile')}
            iconAfter={EditProfileIcon}
            containerStyle={styles.button}
            textStyle={TextStyles.h4}
          />
        </View>

        {userData?.about_me && (
          <View style={styles.aboutMeContainer}>
            <Text style={styles.aboutMeTitle}>ABOUT ME</Text>
            <View style={styles.aboutMeContent}>
              <Text style={styles.aboutMeText}>{userData?.about_me}</Text>
            </View>
          </View>
        )}
      </View>
    </View>
  );
};

export default User;

const styles = StyleSheet.create({
  coverImage: {
    width: '100%',
    height: 168
  },
  settingsButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.gray01_50,
    borderWidth: 0
  },
  profileContainer: {
    position: 'absolute',
    top: 136,
    left: 0,
    right: 0,
    bottom: 0,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    backgroundColor: colors.gray04,
    paddingHorizontal: 16,
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
    justifyContent: 'center'
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60
  },
  statusButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 32,
    height: 32,
    borderRadius: 16
  },
  nameContainer: {
    marginTop: 64,
    paddingHorizontal: 16
  },
  displayName: {
    fontFamily: fonts.black,
    fontSize: 36,
    color: colors.black
  },
  username: {
    fontFamily: fonts.regular,
    fontSize: 20,
    color: colors.gray02
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 16
  },
  button: {
    flex: 1,
    height: 43,
    borderRadius: 32,
    backgroundColor: colors.primary
  },
  aboutMeContainer: {},
  aboutMeTitle: {
    fontFamily: fonts.black,
    fontSize: 14,
    color: colors.black,
    marginLeft: 16
  },
  aboutMeContent: {
    padding: 16,
    borderRadius: 20,
    borderWidth: 3,
    borderColor: colors.gray02
  },
  aboutMeText: {
    fontFamily: fonts.regular,
    fontSize: 14,
    color: colors.black
  },
  onlineStatusItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8
  },
  onlineStatusCircle: {
    width: 16,
    height: 16,
    borderRadius: 8
  }
});
