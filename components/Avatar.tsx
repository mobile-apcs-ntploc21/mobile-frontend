import { StyleSheet, Text, View, Image } from 'react-native';
import { colors } from '@/constants/theme';
import { DefaultProfileImage } from '@/constants/images';
import { getOnlineStatusColor } from '@/utils/user';
import { StatusType } from '@/types/user_status';

interface AvatarProps {
  avatarURI?: string;
  showStatus?: boolean;
}

const Avatar = ({ avatarURI, showStatus = true }: AvatarProps) => {
  return (
    <View style={styles.profilePicContainer}>
      <Image
        source={avatarURI ? { uri: avatarURI } : DefaultProfileImage}
        style={styles.profilePic}
      />
      {showStatus && (
        <View
          style={[
            styles.onlineStatus,
            {
              backgroundColor: getOnlineStatusColor(StatusType.DO_NOT_DISTURB)
            }
          ]}
        />
      )}
    </View>
  );
};

export default Avatar;

const styles = StyleSheet.create({
  profilePicContainer: {},
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
