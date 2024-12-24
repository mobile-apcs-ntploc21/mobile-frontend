import { router } from 'expo-router';
import { FlatList, StyleSheet, Text, TextInput, View } from 'react-native';
import GlobalStyles from '@/styles/GlobalStyles';
import { colors } from '@/constants/theme';
import { TextStyles } from '@/styles/TextStyles';
import { MaterialIcons } from '@expo/vector-icons';
import React, { useMemo } from 'react';
import MyButtonTextIcon from '@/components/MyButton/MyButtonTextIcon';
import GroupIcon from '@/assets/icons/GroupIcon';
import MyText from '@/components/MyText';
import Avatar from '@/components/Avatar';
import DMItem from '@/components/DMItem';
import { useDMContext } from '@/context/DMProvider';
import { useConversations } from '@/context/ConversationsProvider';

// const users: string[] = Array.from({ length: 10 }).map((_, index) => `${index}`);

const convertTimeToNumber = (timestamp: string) => {
  return new Date(timestamp).getTime();
};

export default function DM() {
  const { data: dmChannels, loading } = useDMContext();
  const { conversations } = useConversations();
  const sortedChannels = useMemo(
    () =>
      dmChannels?.sort((a, b) => {
        const aConversation = conversations.find(
          (c) => c.id === a.conversation_id
        );
        const bConversation = conversations.find(
          (c) => c.id === b.conversation_id
        );
        if (!aConversation || !bConversation) return 0;
        return (
          convertTimeToNumber(bConversation.messages[0].createdAt) -
          convertTimeToNumber(aConversation.messages[0].createdAt)
        );
      }),
    [dmChannels, conversations]
  );

  return (
    <View
      style={[
        GlobalStyles.screen,
        {
          backgroundColor: colors.white
        }
      ]}
    >
      {/*{isFocused && <StatusBar backgroundColor={colors.secondary} />}*/}
      <View style={styles.headerContainer}>
        <View style={styles.header}>
          <Text style={TextStyles.superHeader}>DM</Text>
          <MyButtonTextIcon
            title="Friends"
            onPress={() => router.navigate('./dm/friends')}
            iconAfter={GroupIcon}
            containerStyle={styles.friendsButton}
            textStyle={TextStyles.h4}
            gap={22}
          />
        </View>
        <View>
          <View style={styles.searchBarContainer}>
            <MaterialIcons name="search" size={24} color={colors.gray01} />
            <TextInput
              style={styles.searchInput}
              // value={searchText}
              // onChangeText={setSearchText}
              placeholder="Enter username"
            />
          </View>
          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            style={{ marginHorizontal: -16, marginTop: 18 }}
            contentContainerStyle={{
              gap: 18,
              paddingHorizontal: 16
            }}
            data={dmChannels}
            keyExtractor={(item) => item.user_id}
            renderItem={({ item }) => (
              <View style={{ width: 60, gap: 4 }}>
                <Avatar
                  id={item.user_id}
                  avatarStyle={{ width: 60, height: 60, borderRadius: 30 }}
                  profilePic={item.avatar_url}
                  showStatus
                />
                <MyText
                  style={{ alignSelf: 'center' }}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  {item.name}
                </MyText>
              </View>
            )}
          />
        </View>
      </View>
      <FlatList
        data={sortedChannels}
        keyExtractor={(item) => item.user_id}
        renderItem={({ item }) => <DMItem user_id={item.user_id} />}
        contentContainerStyle={{ paddingVertical: 12, gap: 16 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    width: '100%',
    backgroundColor: colors.secondary,
    paddingHorizontal: 16,
    paddingVertical: 24,
    gap: 32,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    zIndex: 1
  },
  header: {
    flexDirection: 'row',
    gap: 16,
    justifyContent: 'space-between'
  },
  contentContainer: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    gap: 8
  },
  searchBarContainer: {
    height: 32,
    alignItems: 'center',
    paddingHorizontal: 8,
    gap: 8,
    flexDirection: 'row',
    backgroundColor: colors.gray04,
    borderRadius: 16
  },
  searchInput: {
    flex: 1,
    ...TextStyles.bodyL
  },
  friendsButton: {
    width: 'auto',
    height: 36,
    borderRadius: 32,
    backgroundColor: colors.primary,
    borderWidth: 0,
    paddingHorizontal: 12
  }
});
