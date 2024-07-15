import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { useEffect, useRef } from 'react';
import { router, useLocalSearchParams, useNavigation } from 'expo-router';
import { colors, fonts } from '@/constants/theme';
import MyButtonTextIcon from '@/components/MyButton/MyButtonTextIcon';
import StatusBubble from '@/components/StatusBubble';
import { DefaultCoverImage, DefaultProfileImage } from '@/constants/images';
import SettingIcon from '@/assets/icons/SettingIcon';
import MyButtonIcon from '@/components/MyButton/MyButtonIcon';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import GlobalStyles from '@/styles/GlobalStyles';
import MessageIcon from '@/assets/icons/MessageIcon';
import { TextStyles } from '@/styles/TextStyles';
import FriendIcon from '@/assets/icons/FriendIcon';
import DotsIcon from '@/assets/icons/DotsIcon';
import ArrowBackIcon from '@/assets/icons/ArrowBackIcon';

const UserById = () => {
  const { userId } = useLocalSearchParams();
  const bottomSheetRef = useRef<BottomSheetModal>(null);
  const navigation = useNavigation();

  return (
    <View style={GlobalStyles.screen}>
      {/* <OnlineStatusBottomSheetModal
        ref={bottomSheetRef}
        onClose={() => bottomSheetRef.current?.dismiss()}
      /> */}
      <Image source={DefaultCoverImage} style={styles.coverImage} />
      {router.canGoBack() && (
        <MyButtonIcon
          icon={ArrowBackIcon}
          onPress={() => router.back()}
          containerStyle={styles.arrowBackButton}
          textColor={colors.white}
        />
      )}
      <MyButtonIcon
        icon={DotsIcon}
        onPress={() => bottomSheetRef.current?.present()}
        containerStyle={styles.settingsButton}
        textColor={colors.white}
      />
      <View style={styles.profileContainer}>
        <View style={styles.profileImageContainer}>
          <View>
            <Image source={DefaultProfileImage} style={styles.profileImage} />
            <View style={styles.statusButton} />
          </View>
        </View>
        <View style={styles.nameContainer}>
          <Text style={styles.displayName}>John Doe {userId}</Text>
          <Text style={styles.username}>@johndoe{userId}</Text>
        </View>
        <StatusBubble
          emoji="👋"
          text="Lorem ipsum dolor sit amet consectetur"
        />
        <View style={styles.buttonContainer}>
          <MyButtonTextIcon
            title="Message"
            onPress={() => {}}
            iconAfter={MessageIcon}
            containerStyle={styles.button}
            textStyle={TextStyles.h4}
          />
          <MyButtonTextIcon
            title="Friends"
            onPress={() => {}}
            iconAfter={FriendIcon}
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

export default UserById;
const styles = StyleSheet.create({
  coverImage: {
    width: '100%',
    height: 168
  },
  arrowBackButton: {
    position: 'absolute',
    top: 16,
    left: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.gray01_50,
    borderWidth: 0
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
