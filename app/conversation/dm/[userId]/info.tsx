import { StyleSheet, Text, View } from 'react-native';
import React, { useLayoutEffect, useMemo } from 'react';
import { router, useLocalSearchParams, useNavigation } from 'expo-router';
import useServer from '@/hooks/useServer';
import { Channel } from '@/types/server';
import { NativeStackHeaderProps } from '@react-navigation/native-stack';
import MyHeader from '@/components/MyHeader';
import GlobalStyles from '@/styles/GlobalStyles';
import { Image } from 'expo-image';
import { DefaultChannelImage, DefaultProfileImage } from '@/constants/images';
import ButtonListText from '@/components/ButtonList/ButtonListText';
import { TextStyles } from '@/styles/TextStyles';
import { useDMContext } from '@/context/DMProvider';
import { useUserById } from '@/hooks/useUserById';

const DMInfo = () => {
  const navigation = useNavigation();
  const { userId } = useLocalSearchParams<{
    userId: string;
  }>();
  const { data: dmChannels } = useDMContext();
  const channel = useMemo(
    () => dmChannels.find((channel) => channel.user_id === userId),
    [dmChannels, userId]
  );
  const { data: userProfile } = useUserById(userId);

  useLayoutEffect(() => {
    const channelName = channel?.name;
    navigation.setOptions({
      header: (props: NativeStackHeaderProps) => (
        <MyHeader {...props} title="Information" />
      )
    });
  });
  return (
    <View style={GlobalStyles.screenGray}>
      <View style={styles.container}>
        <View style={styles.infoContainer}>
          <Image
            source={userProfile.avatar_url || DefaultProfileImage}
            style={styles.channelImg}
          />
          <Text style={styles.channelName}>{channel?.name}</Text>
        </View>
        <ButtonListText
          items={[
            {
              text: 'View profile',
              onPress: () => router.navigate(`/user/${userId}`)
            },
            {
              text: 'Search',
              onPress: () => router.navigate('./search')
            },
            {
              text: 'View pinned messages',
              onPress: () => router.navigate('./pin')
            },
            {
              text: 'Notifications',
              onPress: () => {}
            }
          ]}
        />
      </View>
    </View>
  );
};

export default DMInfo;

const styles = StyleSheet.create({
  container: {
    padding: 16,
    gap: 16
  },
  infoContainer: {
    alignItems: 'center',
    gap: 8
  },
  channelImg: {
    width: 80,
    height: 80,
    borderRadius: 40
  },
  channelName: {
    ...TextStyles.h2
  }
});
