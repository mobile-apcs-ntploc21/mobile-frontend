import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useMemo, useState } from 'react';

import ChannelItem from '@/components/Servers_Channels/ChannelItem';
import MyButtonIcon from '@/components/MyButton/MyButtonIcon';
import StarIcon from '@/assets/icons/StarIcon';
import AddFriendIcon from '@/assets/icons/AddFriendIcon';
import SettingIcon from '@/assets/icons/SettingIcon';
import MyText from '@/components/MyText';
import Avatar from '@/components/Avatar';
import DotsIcon from '@/assets/icons/DotsIcon';
import { colors, fonts } from '@/constants/theme';
import useServers from '@/hooks/useServers';
import Accordion from '@/components/Accordion';
import { router } from 'expo-router';

const MAXUSERS = 4;

const ServerInfo = () => {
  const { servers, currentServerId } = useServers();
  const [userIds, setUserIds] = useState<string[]>(
    Array.from({ length: 10 }, (_, i) => i.toString())
  );

  const thisServer = useMemo(
    () => servers.find((server) => server.id === currentServerId),
    [servers, currentServerId]
  );

  return (
    <View style={styles.container}>
      <View style={styles.serverInfoContainer}>
        <View style={styles.serverContainer}>
          <View style={styles.serverimg} />
          <MyText style={styles.serverName}>{thisServer?.name}</MyText>
        </View>
        <View style={styles.serverActions}>
          <MyButtonIcon
            icon={StarIcon}
            onPress={() => {}}
            showOutline={false}
            containerStyle={styles.actionStyle}
          />
          <MyButtonIcon
            icon={AddFriendIcon}
            onPress={() => {}}
            showOutline={false}
            containerStyle={styles.actionStyle}
          />
          <MyButtonIcon
            icon={SettingIcon}
            onPress={() => {}}
            showOutline={false}
            containerStyle={styles.actionStyle}
          />
        </View>
      </View>
      <View style={styles.activeMembersContainer}>
        <MyText style={styles.activeTitle}>Active (40)</MyText>
        <View style={styles.activeMembers}>
          {userIds.slice(0, MAXUSERS).map((id) => (
            <Avatar key={id} id={id} avatarStyle={styles.activeMember} />
          ))}
          {userIds.length > MAXUSERS && (
            <MyButtonIcon
              icon={DotsIcon}
              onPress={() => router.navigate('server-members')}
              showOutline={false}
              containerStyle={styles.activeMember}
            />
          )}
        </View>
      </View>
      <View style={styles.separator} />
      <ScrollView
        style={styles.newsContainer}
        contentContainerStyle={{
          rowGap: 16,
          paddingTop: 16,
          paddingBottom: 85 + 16
        }}
      >
        {/* Uncategorized channels */}
        <View style={styles.newsWrapper}>
          <ChannelItem />
          <ChannelItem unreadCount={3} />
        </View>
        {/* Categorized channels */}
        <Accordion heading={'General'} defaultOpen>
          <ChannelItem />
          <ChannelItem unreadCount={3} />
        </Accordion>
        <Accordion heading={'Project'} defaultOpen>
          <ChannelItem />
          <ChannelItem unreadCount={3} />
        </Accordion>
      </ScrollView>
    </View>
  );
};

export default ServerInfo;

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  serverInfoContainer: {
    marginTop: 16,
    marginHorizontal: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  serverContainer: {
    flexDirection: 'row',
    gap: 13,
    alignItems: 'center'
  },
  serverimg: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.gray03
  },
  serverName: {
    fontSize: 20,
    fontFamily: fonts.black
  },
  serverActions: {
    flexDirection: 'row',
    gap: 8
  },
  actionStyle: {
    width: 24,
    height: 24,
    padding: 4
  },
  activeMembersContainer: {
    marginTop: 13,
    marginHorizontal: 16
  },
  activeTitle: {
    fontSize: 15,
    fontFamily: fonts.bold
  },
  activeMembers: {
    marginTop: 8,
    flexDirection: 'row',
    gap: 16
  },
  activeMember: {
    width: 56,
    height: 56,
    borderRadius: 28
  },
  separator: {
    marginTop: 16,
    height: 1,
    backgroundColor: colors.gray03
  },
  newsContainer: {
    flex: 1,
    paddingHorizontal: 16
  },
  newsWrapper: {
    backgroundColor: colors.white,
    borderRadius: 21,
    paddingVertical: 16
  }
});
