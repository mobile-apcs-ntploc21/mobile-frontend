import {
  ActivityIndicator,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
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
import {
  acceptFriendRequest,
  addFriend,
  blockUser,
  cancelFriendRequest,
  declineFriendRequest,
  deleteFriend,
  getUserRelationship,
  unblockUser
} from '@/services/friend';
import { IconProps } from '@/types';
import { getOnlineStatusColor } from '@/utils/user';
import { useUserById } from '@/hooks/useUserById';

const UserById = () => {
  const { userId } = useLocalSearchParams<{ userId: string }>();
  const bottomSheetRef = useRef<BottomSheetModal>(null);
  const navigation = useNavigation();
  const [relationship, setRelationship] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const { data: userData } = useUserById(userId!);

  const fetchRelationship = async () => {
    try {
      const response = await getUserRelationship(userId!);
      setRelationship(response);
    } catch (e) {
      console.error(e);
    }
  };

  const fetchData = async () => {
    setLoading(true);
    await fetchRelationship();
    setLoading(false);
  };

  useLayoutEffect(() => {
    fetchData();
  }, []);

  // FRIENDS MANAGEMENT -------------------------------------

  const handleAddFriend = async () => {
    try {
      await addFriend(userId!);
    } catch (e) {
      console.error(e);
    } finally {
      await fetchData();
      handleCloseBottomSheet();
    }
  };

  const handleCancelRequest = async () => {
    try {
      await cancelFriendRequest(userId!);
    } catch (e) {
      console.error(e);
    } finally {
      await fetchData();
      handleCloseBottomSheet();
    }
  };

  const handleAcceptRequest = async () => {
    try {
      await acceptFriendRequest(userId!);
    } catch (e) {
      console.error(e);
    } finally {
      await fetchData();
      handleCloseBottomSheet();
    }
  };

  const handleDeclineRequest = async () => {
    try {
      await declineFriendRequest(userId!);
    } catch (e) {
      console.error(e);
    } finally {
      await fetchData();
      handleCloseBottomSheet();
    }
  };

  const handleUnfriend = async () => {
    try {
      await deleteFriend(userId!);
    } catch (e) {
      console.error(e);
    } finally {
      await fetchData();
      handleCloseBottomSheet();
    }
  };

  const handleBlock = async () => {
    try {
      await blockUser(userId!);
    } catch (e) {
      console.error(e);
    } finally {
      await fetchData();
      handleCloseBottomSheet();
    }
  };

  const handleUnblock = async () => {
    try {
      await unblockUser(userId!);
    } catch (e) {
      console.error(e);
    } finally {
      await fetchData();
      handleCloseBottomSheet();
    }
  };

  // ---------------------------------------------------------

  const handleOpenBottomSheet = () => {
    bottomSheetRef.current?.present();
  };

  const handleCloseBottomSheet = () => {
    bottomSheetRef.current?.dismiss();
  };

  const renderFriendButton = (relationship: string) => {
    let props: {
      title: string;
      onPress: () => void;
      iconAfter?: React.ComponentType<IconProps>;
      containerStyle: any;
      textStyle: any;
    } = {
      title: '',
      onPress: handleOpenBottomSheet,
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
      case 'BLOCK':
        props = {
          ...props,
          title: 'Unblock'
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
      relationship === 'BLOCK'
        ? {
            text: 'Unblock',
            onPress: handleUnblock
          }
        : {
            text: 'Block',
            onPress: handleBlock
          }
    ];
    switch (relationship) {
      case 'FRIEND':
        items.push({
          text: 'Unfriend',
          onPress: handleUnfriend
        });
        break;
      case 'REQUEST-SENT':
        items.push({
          text: 'Cancel Request',
          onPress: handleCancelRequest
        });
        break;
      case 'REQUEST-RECEIVED':
        items.push({
          text: 'Accept',
          onPress: handleAcceptRequest
        });
        items.push({
          text: 'Decline',
          onPress: handleDeclineRequest
        });
        break;
      case 'BLOCK':
        break;
      default:
        items.push({
          text: 'Add Friend',
          onPress: handleAddFriend
        });
        break;
    }
    return <ButtonListText items={items} />;
  };

  if (loading) {
    return <ActivityIndicator />;
  }

  return (
    <View style={GlobalStyles.screen}>
      <MyBottomSheetModal
        heading={userId?.toString()}
        ref={bottomSheetRef}
        onClose={handleCloseBottomSheet}
      >
        {renderBottomSheetContent()}
      </MyBottomSheetModal>
      <Image
        source={
          userData?.banner_url
            ? { uri: userData.banner_url }
            : DefaultCoverImage
        }
        style={styles.coverImage}
      />
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
                styles.onlineStatus,
                {
                  backgroundColor: getOnlineStatusColor(
                    userData?.onlineStatus?.type
                  )
                }
              ]}
            />
          </View>
        </View>
        <View style={styles.nameContainer}>
          <Text style={styles.displayName}>{userData?.display_name}</Text>
          <Text style={styles.username}>@{userData?.username}</Text>
        </View>
        {userData?.onlineStatus?.status_text && (
          <StatusBubble
            // emoji="👋"
            text={userData?.onlineStatus?.status_text}
          />
        )}
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
  }
});
