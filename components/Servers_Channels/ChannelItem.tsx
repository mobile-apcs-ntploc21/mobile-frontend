import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { colors, fonts } from '@/constants/theme';
import MyText from '../MyText';
import { TextStyles } from '@/styles/TextStyles';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { router } from 'expo-router';

interface ChannelItemProps {
  name: string;
  unreadCount?: number;
  channel_id: string;
}

const ChannelItem = (props: ChannelItemProps) => {
  const { unreadCount = 0 } = props;
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() =>
        router.navigate(`conversation/channel/${props.channel_id}`)
      }
    >
      <View style={styles.channelContainer}>
        <View style={styles.channelImg} />
        <View style={styles.channelMessageContainer}>
          <MyText style={styles.channelName}>{props.name}</MyText>
          <MyText style={TextStyles.bodyM}>Hello World!</MyText>
        </View>
      </View>
      <View style={styles.infoContainer}>
        <MyText style={TextStyles.bodyM}>2h</MyText>
        {unreadCount > 0 && (
          <View style={styles.unreadContainer}>
            <MyText style={{ color: colors.white }}>3</MyText>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

export default ChannelItem;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 4
  },
  channelContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12
  },
  infoContainer: {
    gap: 4,
    alignItems: 'flex-end'
  },
  channelImg: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.gray03
  },
  channelMessageContainer: {
    gap: 8
  },
  channelName: {
    fontSize: 12,
    fontFamily: fonts.bold
  },
  unreadContainer: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center'
  }
});
