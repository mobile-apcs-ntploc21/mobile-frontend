import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React from 'react';
import UserItemBase, { UserItemBaseProps } from './UserItemBase';
import MyButtonPress from '../MyButton/MyButtonPress';
import { MyButtonText } from '../MyButton';
import { TextStyles } from '@/styles/TextStyles';
import { colors } from '@/constants/theme';

interface UserItemReqSentProps extends UserItemBaseProps {}

const UserItemReqSent = (props: UserItemReqSentProps) => {
  return (
    <UserItemBase
      actionView={
        <MyButtonPress
          comp={(props) => (
            <MyButtonText
              {...props}
              title="Cancel Request"
              onPress={() => {}}
              activeOpacity={1}
              containerStyle={styles.button}
              textStyle={TextStyles.bodyM}
              textColor={colors.semantic_red}
              backgroundColor={colors.white}
            />
          )}
        />
      }
      {...props}
    />
  );
};

export default UserItemReqSent;

const styles = StyleSheet.create({
  button: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    width: 'auto',
    height: 'auto'
  }
});
