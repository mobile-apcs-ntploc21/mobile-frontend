import {
  Image,
  StyleSheet,
  Text,
  Touchable,
  TouchableOpacity,
  View
} from 'react-native';
import React from 'react';
import GlobalStyles from '@/styles/GlobalStyles';
import { DefaultCoverImage, DefaultProfileImage } from '@/constants/images';
import { colors, fonts } from '@/constants/theme';
import StatusBubble from '@/components/StatusBubble';

const User = () => {
  return (
    <View style={GlobalStyles.screen}>
      <Image source={DefaultCoverImage} style={styles.coverImage} />
      {/* TODO: replace with settings button */}
      <View style={styles.settingsButton} />
      <View style={styles.profileContainer}>
        <View style={styles.profileImageContainer}>
          <TouchableOpacity onPress={() => {}}>
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
          {/* TODO: replace with actual button */}
          <View style={styles.button} />
          <View style={styles.button} />
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
    backgroundColor: colors.gray01,
    opacity: 0.5
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
