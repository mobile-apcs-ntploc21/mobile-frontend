import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
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
import PendingFriendIcon from '@/assets/icons/PendingFriendIcon';
import AddFriendIcon from '@/assets/icons/AddFriendIcon';
import MyBottomSheetModal from '@/components/modal/MyBottomSheetModal';
import ButtonListText from '@/components/ButtonList/ButtonListText';

const UserById = () => {
  const { userId } = useLocalSearchParams();
  const bottomSheetRef = useRef<BottomSheetModal>(null);
  const navigation = useNavigation();
  const [relationship, setRelationship] = useState<string>('');

  useEffect(() => {
    // Fetch user data
    // Fetch relationship
    setRelationship('FRIEND');
  }, []);

  const handleOpenBottomSheet = () => {
    bottomSheetRef.current?.present();
  };

  const handleCloseBottomSheet = () => {
    bottomSheetRef.current?.dismiss();
  };

  const renderFriendButton = (relationship: string) => {
    let props = {
      title: '',
      onPress: handleOpenBottomSheet,
      iconAfter: FriendIcon,
      containerStyle: styles.button,
      textStyle: TextStyles.h4
    };

    switch (relationship) {
      case 'FRIEND':
        props = {
          ...props,
          title: 'Friends',
          iconAfter: FriendIcon
        };
        break;
      case 'REQUEST-SENT':
        props = {
          ...props,
          title: 'Pending',
          iconAfter: PendingFriendIcon
        };
        break;
      case 'REQUEST-RECEIVED':
        props = {
          ...props,
          title: 'Accept',
          iconAfter: AddFriendIcon
        };
        break;
      default:
        props = {
          ...props,
          title: 'Add Friend',
          iconAfter: AddFriendIcon
        };
        break;
    }

    return <MyButtonTextIcon {...props} />;
  };

  const renderBottomSheetContent = () => {
    // the content should vary based on the relationship
    const items = [
      {
        text: 'Block',
        onPress: () => {}
      }
    ];
    switch (relationship) {
      case 'FRIEND':
        items.push({
          text: 'Unfriend',
          onPress: () => {}
        });
        break;
      case 'REQUEST-SENT':
        items.push({
          text: 'Cancel Request',
          onPress: () => {}
        });
        break;
      case 'REQUEST-RECEIVED':
        items.push({
          text: 'Accept',
          onPress: () => {}
        });
        items.push({
          text: 'Decline',
          onPress: () => {}
        });
        break;
      default:
        items.push({
          text: 'Add Friend',
          onPress: () => {}
        });
        break;
    }
    return <ButtonListText items={items} />;
  };

  return (
    <View style={GlobalStyles.screen}>
      <MyBottomSheetModal
        heading={userId?.toString()}
        ref={bottomSheetRef}
        onClose={handleCloseBottomSheet}
      >
        {renderBottomSheetContent()}
      </MyBottomSheetModal>
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
        onPress={handleOpenBottomSheet}
        containerStyle={styles.settingsButton}
        textColor={colors.white}
      />
      <View style={styles.profileContainer}>
        <View style={styles.profileImageContainer}>
          <View>
            <Image source={DefaultProfileImage} style={styles.profileImage} />
            <View style={styles.onlineStatus} />
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
          {renderFriendButton(relationship)}
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
  onlineStatus: {
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
