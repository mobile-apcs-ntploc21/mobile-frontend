import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View
} from 'react-native';
import { ReactNode, useCallback, useState } from 'react';
import { colors } from '@/constants/theme';
import { router, useFocusEffect } from 'expo-router';
import { TextStyles } from '@/styles/TextStyles';
import MyText from '../MyText';
import Avatar, { AvatarCommonProps } from '../Avatar';
import { useApolloClient } from '@apollo/client';
import { getData } from '@/utils/api';
import { USER_STATUS_SUBSCRIPTION } from '@/services/graphql/subscriptions';
import { StatusType } from '@/types/user_status';

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
export interface UserItemBaseProps extends AvatarCommonProps {
  id: string;
  username: string;
  displayName?: string;
  actionView?: ReactNode;
  subscribeToStatus?: boolean;
}

const UserItemBase = (props: UserItemBaseProps) => {
  const wsClient = useApolloClient();
  const [isOnline, setIsOnline] = useState(false);
  const [statusType, setStatusType] = useState(StatusType.OFFLINE);
  const [statusText, setStatusText] = useState('');

  useFocusEffect(
    useCallback(() => {
      if (!props.subscribeToStatus) return;

      getData(`/api/v1/status/${props.id}`)
        .then((res) => {
          setIsOnline(res?.is_online);
          setStatusType(res?.type);
          setStatusText(res?.status_text);
        })
        .catch(() => {
          setIsOnline(false);
          setStatusType(StatusType.OFFLINE);
          setStatusText('');
        });

      const observable = wsClient.subscribe({
        query: USER_STATUS_SUBSCRIPTION,
        variables: { user_id: props.id }
      });
      const cleanup = observable.subscribe({
        next({ data: { userStatusChanged } }) {
          setIsOnline(userStatusChanged?.is_online);
          setStatusType(userStatusChanged?.type);
          setStatusText(userStatusChanged?.status_text);
        }
      });
      return () => cleanup.unsubscribe();
    }, [props.subscribeToStatus])
  );

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => router.navigate(`/user/${props.id}`)}
    >
      <View style={styles.contentContainer}>
        <Avatar {...props} isOnline={isOnline} statusType={statusType} />
        <View style={styles.textContainer}>
          <MyText style={TextStyles.h5}>{props.displayName}</MyText>
          <MyText
            style={[
              TextStyles.bodyM,
              {
                color: colors.gray02
              }
            ]}
          >
            {statusText || getDefaultStatusText(statusType)}
          </MyText>
        </View>
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
  statusType: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.status_offline,
    position: 'absolute',
    bottom: 0,
    right: 0
  },
  textContainer: {
    gap: 4
  }
});
