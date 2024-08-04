import { StyleSheet, Text, View, Image } from 'react-native';
import { colors } from '@/constants/theme';
import { DefaultProfileImage } from '@/constants/images';
import { getOnlineStatusColor } from '@/utils/user';
import { StatusType } from '@/types/user_status';
import { useApolloClient } from '@apollo/client';
import { useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { USER_STATUS_SUBSCRIPTION } from '@/services/graphql/subscriptions';
import { subscribe } from 'graphql';

export interface AvatarProps {
  id: string;
  profilePic?: string;
  showStatus?: boolean;
  onlineStatus?: StatusType;
  subscribeToStatus?: boolean;
}

const Avatar = ({
  id,
  profilePic,
  showStatus,
  onlineStatus,
  subscribeToStatus
}: AvatarProps) => {
  const wsClient = useApolloClient();
  const [isOnline, setIsOnline] = useState(false);
  const [statusType, setStatusType] = useState(StatusType.OFFLINE);

  useFocusEffect(
    useCallback(() => {
      if (!subscribeToStatus) return;
      const observable = wsClient.subscribe({
        query: USER_STATUS_SUBSCRIPTION,
        variables: { user_id: id }
      });
      const cleanup = observable.subscribe({
        next({ data: { userStatusChanged } }) {
          setIsOnline(userStatusChanged?.is_online);
          setStatusType(userStatusChanged?.type);
        }
      });
      return () => cleanup.unsubscribe();
    }, [subscribeToStatus])
  );

  return (
    <View style={styles.profilePicContainer}>
      <Image
        source={profilePic ? { uri: profilePic } : DefaultProfileImage}
        style={styles.profilePic}
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
