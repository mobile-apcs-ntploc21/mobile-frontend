import { StyleSheet, View, Image, ImageStyle } from 'react-native';
import { colors } from '@/constants/theme';
import { DefaultProfileImage } from '@/constants/images';
import { getOnlineStatusColor } from '@/utils/user';
import { StatusType } from '@/types/user_status';
import { useFocusEffect } from 'expo-router';
import { Dispatch, useCallback, useState } from 'react';
import { useApolloClient } from '@apollo/client';
import { getData } from '@/utils/api';
import { USER_STATUS_SUBSCRIPTION } from '@/services/graphql/subscriptions';

const getDefaultStatusText = (statusType: StatusType) => {
  switch (statusType) {
    case StatusType.ONLINE:
      return 'Online';
    case StatusType.IDLE:
      return 'Idle';
    case StatusType.DO_NOT_DISTURB:
      return 'Do Not Disturb';
    default:
      return 'Offline';
  }
};

export interface AvatarProps {
  id: string;
  profilePic?: string;
  showStatus?: boolean;
  onlineStatus?: StatusType;
  subscribeToStatus?: boolean;
  avatarStyle?: ImageStyle;
  setStatusText?: Dispatch<React.SetStateAction<string>>;
}

const Avatar = ({
  id,
  profilePic,
  showStatus,
  onlineStatus,
  avatarStyle,
  subscribeToStatus,
  setStatusText: setTextProps
}: AvatarProps) => {
  const wsClient = useApolloClient();
  const [isOnline, setIsOnline] = useState(false);
  const [statusType, setStatusType] = useState(StatusType.OFFLINE);

  const setStatusText = (text: string) => {
    setTextProps && setTextProps(text);
  };

  useFocusEffect(
    useCallback(() => {
      if (!subscribeToStatus) return;

      getData(`/api/v1/status/${id}`)
        .then((res) => {
          setIsOnline(res?.is_online);
          setStatusType(res?.type);
          setStatusText(
            res?.status_text ||
              getDefaultStatusText(
                onlineStatus ??
                  (res?.is_online ? res?.type : StatusType.OFFLINE)
              )
          );
        })
        .catch(() => {
          setIsOnline(false);
          setStatusType(StatusType.OFFLINE);
          setStatusText('');
        });

      const observable = wsClient.subscribe({
        query: USER_STATUS_SUBSCRIPTION,
        variables: { user_id: id }
      });
      const cleanup = observable.subscribe({
        next({ data: { userStatusChanged } }) {
          setIsOnline(userStatusChanged?.is_online);
          setStatusType(userStatusChanged?.type);
          setStatusText(
            userStatusChanged?.status_text ||
              getDefaultStatusText(
                onlineStatus ??
                  (userStatusChanged?.is_online
                    ? userStatusChanged?.type
                    : StatusType.OFFLINE)
              )
          );
        }
      });
      return () => cleanup.unsubscribe();
    }, [subscribeToStatus])
  );

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
