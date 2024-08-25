import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View
} from 'react-native';
import { ReactNode, useState } from 'react';
import { colors } from '@/constants/theme';
import { router } from 'expo-router';
import { TextStyles } from '@/styles/TextStyles';
import MyText from '../MyText';
import Avatar, { AvatarProps } from '../Avatar';

export interface UserItemBaseProps extends AvatarProps {
  id: string;
  username: string;
  displayName?: string;
  actionView?: ReactNode;
  subscribeToStatus?: boolean;
}

const UserItemBase = (props: UserItemBaseProps) => {
  const [statusText, setStatusText] = useState('');

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => router.navigate(`/user/${props.id}`)}
    >
      <View style={styles.contentContainer}>
        <Avatar {...props} setStatusText={setStatusText} />
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
            {statusText}
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
