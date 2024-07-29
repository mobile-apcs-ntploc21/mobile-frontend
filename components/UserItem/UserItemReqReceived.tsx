import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import MyButtonIcon from '../MyButton/MyButtonIcon';
import UserItemBase, { UserItemBaseProps } from './UserItemBase';
import MyButtonPress from '../MyButton/MyButtonPress';
import TickIcon from '@/assets/icons/TickIcon';
import { colors } from '@/constants/theme';
import CrossIcon from '@/assets/icons/CrossIcon';

interface UserItemReqSentProps extends UserItemBaseProps {
  onAccept?: () => void;
  onDecline?: () => void;
}

const UserItemReqReceived = (props: UserItemReqSentProps) => {
  return (
    <UserItemBase
      actionView={
        <View style={styles.container}>
          <MyButtonPress
            comp={(subProps) => (
              <MyButtonIcon
                {...subProps}
                icon={TickIcon}
                onPress={props.onAccept}
                activeOpacity={1}
                backgroundColor={colors.white}
                textColor={colors.semantic_green}
                containerStyle={styles.button}
              />
            )}
          />
          <MyButtonPress
            comp={(subProps) => (
              <MyButtonIcon
                {...subProps}
                icon={CrossIcon}
                onPress={props.onDecline}
                activeOpacity={1}
                backgroundColor={colors.white}
                textColor={colors.semantic_red}
                containerStyle={styles.button}
              />
            )}
          />
        </View>
      }
      {...props}
    />
  );
};

export default UserItemReqReceived;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12
  },
  button: {
    width: 32,
    height: 32,
    padding: 6
  }
});
