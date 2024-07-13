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
import OnlineStatusBottomSheetModal from '@/components/modal/OnlineStatusBottomSheetModal';

const User = () => {
  const bottomSheetRef = useRef<BottomSheetModal>(null);

  return (
    <View style={GlobalStyles.screen}>
      <OnlineStatusBottomSheetModal ref={bottomSheetRef} title="abc" />
      <Image source={DefaultCoverImage} style={styles.coverImage} />
      <MyButtonIcon
        icon={SettingIcon}
        onPress={() => {}}
        containerStyle={styles.settingsButton}
        textColor={colors.white}
      />
      <View style={styles.profileContainer}>
        <View style={styles.profileImageContainer}>
          {/* TODO: Open onine status selection list */}
          <TouchableOpacity onPress={() => bottomSheetRef.current?.present()}>
            <Image source={DefaultProfileImage} style={styles.profileImage} />
            <View style={styles.statusButton} />
          </TouchableOpacity>
        </View>
        <View style={styles.nameContainer}>
          <Text style={styles.displayName}>John Doe</Text>
          <Text style={styles.username}>@johndoe</Text>
        </View>
        <StatusBubble
          emoji="👋"
          text="Lorem ipsum dolor sit amet consectetur"
        />
        <View style={styles.buttonContainer}>
          <MyButtonTextIcon
            title="Edit Status"
            onPress={() => {}}
            iconAfter={EditStatusIcon}
            containerStyle={styles.button}
            textStyle={TextStyles.h4}
          />
          <MyButtonTextIcon
            title="Edit Profile"
            onPress={() => {}}
            iconAfter={EditProfileIcon}
            containerStyle={styles.button}
            textStyle={TextStyles.h4}
          />
        </View>
        <View style={styles.aboutMeContainer}>
          <Text style={styles.aboutMeTitle}>ABOUT ME</Text>
          <View style={styles.aboutMeContent}>
            <Text style={styles.aboutMeText}>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc
              tincidunt, nunc sit amet tincidunt fermentum, nunc magna
              tincidunt.
            </Text>
          </View>
        </View>
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
    borderRadius: 16,
    backgroundColor: colors.status_online
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
  }
});
