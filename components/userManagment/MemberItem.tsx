import { StyleSheet, Text, View } from 'react-native';
import React, { useEffect, useLayoutEffect, useState } from 'react';
import MyText from '../MyText';
import { colors, fonts } from '@/constants/theme';
import { ServerProfile, UserProfile, UserStatus } from '@/types';
import Avatar from '../Avatar';
import { getData } from '@/utils/api';
import { Skeleton } from 'moti/skeleton';

interface MemberItemProps {
  profile?: ServerProfile;
}

const MemberItem = ({ profile }: MemberItemProps) => (
  <View style={styles.container}>
    <Skeleton colorMode="light" width={44} height={44} radius={'round'}>
      {profile && <Avatar id={profile.user_id} {...{ profile }} showStatus />}
    </Skeleton>
    <View style={styles.info}>
      <Skeleton colorMode="light" width={'50%'} height={16}>
        {profile && (
          <MyText style={styles.nickname}>{profile.display_name}</MyText>
        )}
      </Skeleton>
      <View>
        <Skeleton colorMode="light" width={'100%'} height={16}>
          {profile && (
            <MyText style={styles.username}>@{profile.username}</MyText>
          )}
        </Skeleton>
      </View>
    </View>
  </View>
);

export default MemberItem;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    columnGap: 12,
    alignItems: 'center'
  },
  nickname: {
    fontSize: 12,
    fontFamily: fonts.bold
  },
  username: {
    fontSize: 10
  },
  info: {
    flex: 1,
    rowGap: 4
  }
});
