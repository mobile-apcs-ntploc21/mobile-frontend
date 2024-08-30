import { StyleSheet, Text, View } from 'react-native';
import React, { useEffect, useLayoutEffect, useState } from 'react';
import MyText from '../MyText';
import { colors, fonts } from '@/constants/theme';
import { UserProfile } from '@/types';
import Avatar from '../Avatar';
import { getData } from '@/utils/api';
import { Skeleton } from 'moti/skeleton';

interface MemberItemProps {
  id: string;
}

const MemberItem = (props: MemberItemProps) => {
  const [profile, setProfile] = useState<UserProfile>({
    user_id: props.id,
    display_name: 'User',
    username: 'username',
    about_me: '',
    avatar_url: '',
    banner_url: ''
  });

  useLayoutEffect(() => {
    (async () => {
      try {
        const res = await getData(`/api/v1/profile/${props.id}`);
        setProfile(res);
      } catch (e: any) {
        throw new Error(e);
      }
    })();
  }, []);

  return (
    <View style={styles.container}>
      <Skeleton>
        <Avatar id={profile.user_id} profilePic={profile.avatar_url} />
      </Skeleton>
      <View style={styles.info}>
        <MyText style={styles.nickname}>{profile.display_name}</MyText>
        <MyText style={styles.username}>@{profile.username}</MyText>
      </View>
    </View>
  );
};

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
    rowGap: 4
  }
});
