import { Image } from 'expo-image';
import { useCallback, useMemo, useState } from 'react';
import { Animated, Dimensions, StyleSheet, View, Text } from 'react-native';
import * as Crypto from 'expo-crypto';

import AddFriendIcon from '@/assets/icons/AddFriendIcon';
import DotsIcon from '@/assets/icons/DotsIcon';
import SettingIcon from '@/assets/icons/SettingIcon';
import StarIcon from '@/assets/icons/StarIcon';
import Accordion from '@/components/Accordion';
import Avatar from '@/components/Avatar';
import MyButtonIcon from '@/components/MyButton/MyButtonIcon';
import MyText from '@/components/MyText';
import ChannelItem from '@/components/Servers_Channels/ChannelItem';
import { colors, fonts } from '@/constants/theme';
import useServer from '@/hooks/useServer';
import useServers from '@/hooks/useServers';
import { router } from 'expo-router';
import { checkOnline } from '@/utils/status';

const MAXUSERS = 4;
const SCREEN_HEIGHT = Dimensions.get('window').height;

interface ServerInfoProps {
  scrollY: Animated.Value;
}

const ServerInfo = (props: ServerInfoProps) => {
  const { servers, currentServerId } = useServers();
  const { server_id, categories, members, permissions } = useServer();

  const nbOnline = useMemo(
    () =>
      members.filter(({ status }) => checkOnline(status.is_online, status.type))
        .length,
    [members]
  );

  const thisServer = useMemo(
    () => servers.find((server) => server.id === currentServerId),
    [servers, currentServerId]
  );

  // =============== UI ===============

  const HandleCategoriesView = useCallback(() => {
    if (!categories) {
      return (
        <View style={styles.newsWrapper}>
          <Text style={{ textAlign: 'center', fontSize: 16 }}>Loading...</Text>
        </View>
      );
    }

    if (
      categories.length === 0 ||
      (categories.length === 1 && categories[0].channels.length === 0)
    ) {
      return (
        <View
          style={{
            flex: 1,
            justifyContent: 'flex-start',
            alignItems: 'center',
            marginHorizontal: 30
          }}
        >
          <Text style={{ textAlign: 'center', fontSize: 16 }}>
            No categories or channels found.{'\n'}Create a category or channel
            to get started.
          </Text>
        </View>
      );
    }

    return categories?.map((category) => {
      // Uncategorized channels
      if (category.id === null)
        return category.channels.length > 0 ? (
          <View key={Crypto.randomUUID()} style={styles.newsWrapper}>
            {category.channels.map((channel) => (
              <ChannelItem key={Crypto.randomUUID()} channel={channel} />
            ))}
          </View>
        ) : null;
      // Categorized channels
      return (
        <Accordion
          key={Crypto.randomUUID()}
          heading={category.name}
          defaultOpen
        >
          {category.channels.map((channel) => (
            <ChannelItem key={Crypto.randomUUID()} channel={channel} />
          ))}
        </Accordion>
      );
    });
  }, [categories]);

  const handleScroll = (event: any) => {
    const { y } = event.nativeEvent.contentOffset;
    Animated.timing(props.scrollY, {
      toValue: y,
      duration: 0,
      useNativeDriver: true
    }).start();
  };

  const ServerInfo = useCallback(
    () => (
      <View>
        <View style={styles.serverInfoContainer}>
          <View style={styles.serverContainer}>
            {thisServer?.avatar ? (
              <Image
                source={{ uri: thisServer.avatar }}
                style={styles.serverimg}
              />
            ) : (
              <View style={styles.serverimg} />
            )}
            <MyText style={styles.serverName}>{thisServer?.name}</MyText>
          </View>
          <View style={styles.serverActions}>
            <MyButtonIcon
              icon={StarIcon}
              onPress={() => router.navigate(`/server/edit_permissions`)}
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
              onPress={() => router.navigate(`/server/settings`)}
              showOutline={false}
              containerStyle={styles.actionStyle}
            />
          </View>
        </View>
        <View style={styles.activeMembersContainer}>
          <MyText style={styles.activeTitle}>Active ({nbOnline})</MyText>
          <View style={styles.activeMembers}>
            {members
              .slice(0, Math.min(members.length, MAXUSERS))
              .map((member) => (
                <Avatar
                  key={member.user_id}
                  id={member.user_id}
                  profile={member}
                  avatarStyle={styles.activeMember}
                  showStatus
                  // subscribeToStatus
                />
              ))}
            {/* {members.length > MAXUSERS && ( */}
            <MyButtonIcon
              icon={DotsIcon}
              onPress={() => router.navigate('server-members')}
              showOutline={false}
              containerStyle={styles.activeMember}
            />
            {/* )} */}
          </View>
        </View>
      </View>
    ),
    [thisServer, members]
  );

  return (
    <View style={styles.container}>
      <ServerInfo />
      <View style={styles.separator} />
      <Animated.ScrollView
        style={styles.newsContainer}
        contentContainerStyle={{
          rowGap: 16,
          paddingTop: 16,
          paddingBottom: 90 + 16,
          minHeight: SCREEN_HEIGHT + 16
        }}
        scrollEventThrottle={16}
        onScroll={handleScroll}
      >
        {permissions['VIEW_CHANNEL'] && <HandleCategoriesView />}
      </Animated.ScrollView>
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
