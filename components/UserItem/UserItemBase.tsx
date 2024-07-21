import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View
} from 'react-native';
import React, { useCallback } from 'react';
import { DefaultProfileImage } from '@/constants/images';
import { colors } from '@/constants/theme';
import { getOnlineStatusColor } from '@/utils/user';
import { router } from 'expo-router';
import { TextStyles } from '@/styles/TextStyles';
import { MyButtonText } from '../MyButton';

export interface UserItemBaseProps {
  id: string;
  username: string;
  displayName?: string;
  profilePic?: string;
  onlineStatus?: string;
  actionView?: React.ReactNode;
}

const UserItemBase = (props: UserItemBaseProps) => {
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => router.navigate(`/user/${props.id}`)}
    >
      <View style={styles.contentContainer}>
        <View style={styles.profilePicContainer}>
          <Image
            source={
              props.profilePic ? { uri: props.profilePic } : DefaultProfileImage
            }
            style={styles.profilePic}
          />
          <View
            style={[
              styles.onlineStatus,
              {
                backgroundColor: getOnlineStatusColor(
                  props.onlineStatus || 'offline'
                )
              }
            ]}
          />
        </View>
        <Text style={TextStyles.h5}>{props.displayName}</Text>
      </View>
      {/* By some reasons the touch gesture to TouchableOpacity in actionView keeps propagating. This method is used to stop the touch propagation of it. */}
      <TouchableWithoutFeedback>
        <>{props.actionView}</>
      </TouchableWithoutFeedback>
    </TouchableOpacity>
  );
};

export default UserItemBase;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: colors.white
  },
  contentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12
  },
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
