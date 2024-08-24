import { StyleSheet, View, Image, ImageStyle } from 'react-native';
import { colors } from '@/constants/theme';
import { DefaultProfileImage } from '@/constants/images';
import { getOnlineStatusColor } from '@/utils/user';
import { StatusType } from '@/types/user_status';

export interface AvatarCommonProps {
  id: string;
  profilePic?: string;
  showStatus?: boolean;
  onlineStatus?: StatusType;
  avatarStyle?: ImageStyle;
}

interface AvatarProps extends AvatarCommonProps {
  isOnline?: boolean;
  statusType?: StatusType;
}

const Avatar = ({
  id,
  profilePic,
  showStatus,
  onlineStatus,
  avatarStyle,
  isOnline,
  statusType
}: AvatarProps) => {
  const combinedStyles = StyleSheet.flatten([styles.profilePic, avatarStyle]);
  return (
    <View>
      <Image
        source={profilePic ? { uri: profilePic } : DefaultProfileImage}
        style={combinedStyles}
      />
      {showStatus && (
        <View
          style={[
            styles.onlineStatus,
            {
              backgroundColor: getOnlineStatusColor(
                onlineStatus ?? (isOnline ? statusType : StatusType.OFFLINE)
              )
            }
          ]}
        />
      )}
    </View>
  );
};

export default Avatar;

const styles = StyleSheet.create({
  profilePic: {
    width: 44,
    height: 44,
    borderRadius: 22
  },
  onlineStatus: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.status_offline,
    position: 'absolute',
    bottom: 0,
    right: 0
  }
});
