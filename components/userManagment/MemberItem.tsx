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
  const [profile, setProfile] = useState<UserProfile | null>(null);

  useLayoutEffect(() => {
    (async () => {
      try {
        setTimeout(async () => {
          const res = await getData(`/api/v1/profile/${props.id}`);
          setProfile(res);
        }, 3000);
      } catch (e: any) {
        throw new Error(e);
      }
    })();
  }, []);

  return (
    <View style={styles.container}>
      <Skeleton colorMode="light" width={44} height={44} radius={'round'}>
        {profile && (
          <Avatar id={profile.user_id} profilePic={profile.avatar_url} />
        )}
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
    flex: 1,
    rowGap: 4
  }
});
