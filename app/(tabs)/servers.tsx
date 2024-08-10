import AddFriendIcon from '@/assets/icons/AddFriendIcon';
import DotsIcon from '@/assets/icons/DotsIcon';
import SettingIcon from '@/assets/icons/SettingIcon';
import StarIcon from '@/assets/icons/StarIcon';
import Avatar from '@/components/Avatar';
import ChannelItem from '@/components/channels/ChannelItem';
import MyButtonIcon from '@/components/MyButton/MyButtonIcon';
import MyText from '@/components/MyText';
import { DefaultCoverImage } from '@/constants/images';
import { colors, fonts } from '@/constants/theme';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Image, ScrollView } from 'react-native';

const MAXUSERS = 4;

export default function Servers() {
  const [userIds, setUserIds] = useState<string[]>(
    Array.from({ length: 10 }, (_, i) => i.toString())
  );

  useEffect(() => {
    // Fetch data (active users)
  }, []);

  return (
    <View>
      <Image source={DefaultCoverImage} style={styles.coverimg} />
      <View style={styles.container}>
        <View style={styles.serverInfoContainer}>
          <View style={styles.serverContainer}>
            <View style={styles.serverimg}></View>
            <MyText style={styles.serverName}>Server Name</MyText>
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
              <Avatar key={id} id={id} imgStyle={styles.activeMember} />
            ))}
            {userIds.length > MAXUSERS && (
              <MyButtonIcon
                icon={DotsIcon}
                onPress={() => {}}
                showOutline={false}
                containerStyle={styles.activeMember}
              />
            )}
          </View>
        </View>
        <View style={styles.seperator} />
        <ScrollView
          style={styles.newsContainer}
          contentContainerStyle={{ rowGap: 16 }}
        >
          <View style={styles.newsWrapper}>
            <ChannelItem />
          </View>
          <View style={styles.newsWrapper}>
            <ChannelItem unreadCount={3} />
          </View>
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  coverimg: {
    width: '100%',
    height: 177
  },
  container: {
    position: 'absolute',
    width: '100%',
    top: 136,
    height: 600,
    backgroundColor: colors.gray04,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30
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
    padding: 6
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
  seperator: {
    marginVertical: 16,
    height: 1,
    backgroundColor: colors.gray03
  },
  newsContainer: {
    marginHorizontal: 16
  },
  newsWrapper: {
    backgroundColor: colors.white,
    borderRadius: 21,
    padding: 16
  }
});
