import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  RefreshControl,
  Keyboard,
  ActivityIndicator
} from 'react-native';
import React, { useEffect, useLayoutEffect, useState } from 'react';
import GlobalStyles from '@/styles/GlobalStyles';
import { colors } from '@/constants/theme';
import { StatusBar } from 'expo-status-bar';
import { useIsFocused } from '@react-navigation/native';
import { Entypo, MaterialIcons } from '@expo/vector-icons';
import { TextStyles } from '@/styles/TextStyles';
import { router, useNavigation } from 'expo-router';
import Accordion from '@/components/Accordion';
import UserItemReqReceived from '@/components/UserItem/UserItemReqReceived';
import UserItemReqSent from '@/components/UserItem/UserItemReqSent';
import { ScrollView } from 'react-native-gesture-handler';
import { MyButtonText } from '@/components/MyButton';
import UserItemGeneral from '@/components/UserItem/UserItemGeneral';
import {
  acceptFriendRequest,
  addFriend,
  cancelFriendRequest,
  declineFriendRequest,
  getFriendRequestsReceived,
  getFriendRequestsSent,
  getFriends,
  searchByUsername
} from '@/services/friend';
import { showAlert } from '@/services/alert';

const Friends = () => {
  const isFocused = useIsFocused(); // Used to change status bar color
  const [searchText, setSearchText] = useState('');

  const [refreshing, setRefreshing] = React.useState(false);

  const navigation = useNavigation();

  // FRIENDS LISTING  -------------------------------------

  const [requestsSent, setRequestsSent] = useState<any[]>([]);
  const [requestsReceived, setRequestsReceived] = useState<any[]>([]);
  const [allFriends, setAllFriends] = useState<any[]>([]);

  const fetchRequestsSent = async () => {
    try {
      const response = await getFriendRequestsSent();
      setRequestsSent(response);
    } catch (e) {
      console.error(e);
    }
  };

  const fetchRequestsReceived = async () => {
    try {
      const response = await getFriendRequestsReceived();
      setRequestsReceived(response);
    } catch (e) {
      console.error(e);
    }
  };

  const fetchAllFriends = async () => {
    try {
      const response = await getFriends();
      setAllFriends(response);
    } catch (e) {
      console.error(e);
    }
  };

  // -------------------------------------

  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    await fetchRequestsSent();
    await fetchRequestsReceived();
    await fetchAllFriends();
    setLoading(false);
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      fetchData();
    });

    return unsubscribe;
  }, [navigation]);

  // FRIENDS MANAGEMENT -------------------------------------

  const handleAddFriend = async (text: string) => {
    try {
      const user = await searchByUsername(text);
      await addFriend(user.user_id);
      showAlert('Friend request sent');
      await fetchRequestsSent();
      setSearchText('');
    } catch (e) {
      showAlert('Could not send friend request');
    } finally {
      Keyboard.dismiss();
    }
  };

  const handleCancelRequest = async (id: string) => {
    try {
      await cancelFriendRequest(id);
      await fetchRequestsSent();
    } catch (e) {
      console.error(e);
    }
  };

  const handleAcceptRequest = async (id: string) => {
    try {
      await acceptFriendRequest(id);
      await fetchRequestsReceived();
      await fetchAllFriends();
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeclineRequest = async (id: string) => {
    try {
      await declineFriendRequest(id);
      await fetchRequestsReceived();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <View
      style={[
        GlobalStyles.screen,
        {
          backgroundColor: colors.gray04
        }
      ]}
    >
      {isFocused && <StatusBar backgroundColor={colors.secondary} />}
      <View style={styles.headerContainer}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.navigate('/dm')}>
            <Entypo name="chevron-thin-left" size={32} color={colors.black} />
          </TouchableOpacity>
          <Text style={TextStyles.superHeader}>Friends</Text>
        </View>
        <View style={styles.searchContainer}>
          <View style={styles.searchBarContainer}>
            <MaterialIcons name="search" size={24} color={colors.gray01} />
            <TextInput
              style={styles.searchInput}
              value={searchText}
              onChangeText={setSearchText}
              placeholder="Enter username"
            />
          </View>
          <MyButtonText
            title="Add"
            onPress={() => handleAddFriend(searchText)}
            containerStyle={styles.button}
            textStyle={TextStyles.h4}
          />
        </View>
      </View>
      <ScrollView
        style={{ flex: 1 }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={async () => {
              setRefreshing(true);
              await fetchRequestsSent();
              await fetchRequestsReceived();
              await fetchAllFriends();
              setRefreshing(false);
            }}
          />
        }
      >
        {loading ? (
          <ActivityIndicator />
        ) : (
          <View style={styles.contentContainer}>
            <Accordion heading={`(${requestsSent.length}) Requests Sent`}>
              {requestsSent.map((request) => (
                <UserItemReqSent
                  key={request.id}
                  id={request.id}
                  username={request.username}
                  displayName={request.username}
                  subscribeToStatus
                  showStatus
                  onCancel={() => handleCancelRequest(request.id)}
                />
              ))}
            </Accordion>
            <Accordion
              heading={`(${requestsReceived.length}) Requests Received`}
            >
              {requestsReceived.map((request) => (
                <UserItemReqReceived
                  key={request.id}
                  id={request.id}
                  username={request.username}
                  displayName={request.username}
                  subscribeToStatus
                  showStatus
                  onAccept={() => handleAcceptRequest(request.id)}
                  onDecline={() => handleDeclineRequest(request.id)}
                />
              ))}
            </Accordion>
            <Accordion
              heading={`(${allFriends.length}) All Friends`}
              defaultOpen
            >
              {allFriends.map((request) => (
                <UserItemGeneral
                  key={request.id}
                  id={request.id}
                  username={request.username}
                  displayName={request.username}
                  subscribeToStatus
                  showStatus
                />
              ))}
            </Accordion>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

export default Friends;

const styles = StyleSheet.create({
  headerContainer: {
    width: '100%',
    height: 163,
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
    gap: 16
  },
  contentContainer: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    gap: 8
  },
  searchContainer: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center'
  },
  searchBarContainer: {
    flexDirection: 'row',
    height: 32,
    flex: 1,
    alignItems: 'center',
    gap: 8,
    backgroundColor: colors.gray04,
    borderRadius: 16,
    paddingHorizontal: 8
  },
  searchInput: {
    flex: 1,
    ...TextStyles.bodyL
  },

  button: {
    height: 44,
    width: 86,
    borderRadius: 32,
    backgroundColor: colors.primary,
    borderWidth: 0
  }
});
