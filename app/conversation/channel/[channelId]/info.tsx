import { StyleSheet, Text, View } from 'react-native';
import React, { useLayoutEffect, useMemo } from 'react';
import { useLocalSearchParams, useNavigation } from 'expo-router';
import useServer from '@/hooks/useServer';
import { Channel } from '@/types/server';
import { NativeStackHeaderProps } from '@react-navigation/native-stack';
import MyHeader from '@/components/MyHeader';
import GlobalStyles from '@/styles/GlobalStyles';
import { Image } from 'expo-image';
import { DefaultChannelImage } from '@/constants/images';
import ButtonListText from '@/components/ButtonList/ButtonListText';
import { TextStyles } from '@/styles/TextStyles';

const ChannelInfo = () => {
  const navigation = useNavigation();
  const { categories } = useServer();
  const { channelId } = useLocalSearchParams<{
    channelId: string;
  }>();
  const channel: Channel | undefined = useMemo(() => {
    return categories
      .map((category) => category.channels)
      .flat()
      .find((channel) => channel.id === channelId);
  }, [categories, channelId]);

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
          <Image source={DefaultChannelImage} style={styles.channelImg} />
          <Text style={styles.channelName}>{channel?.name}</Text>
        </View>
        <ButtonListText
          items={[
            {
              text: 'Search',
              onPress: () => {}
            },
            {
              text: 'View pinned messages',
              onPress: () => {}
            },
            {
              text: 'Notifications',
              onPress: () => {}
            },
            {
              text: 'Channel settings',
              onPress: () => {}
            }
          ]}
        />
      </View>
    </View>
  );
};

export default ChannelInfo;

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
    height: 80
  },
  channelName: {
    ...TextStyles.h2
  }
});
