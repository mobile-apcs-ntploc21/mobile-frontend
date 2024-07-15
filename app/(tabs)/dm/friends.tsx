import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput
} from 'react-native';
import React, { useState } from 'react';
import GlobalStyles from '@/styles/GlobalStyles';
import { colors } from '@/constants/theme';
import { StatusBar } from 'expo-status-bar';
import { useIsFocused } from '@react-navigation/native';
import { Entypo, MaterialIcons } from '@expo/vector-icons';
import { TextStyles } from '@/styles/TextStyles';
import { router } from 'expo-router';
import Accordion from '@/components/Accordion';
import UserItemReqReceived from '@/components/UserItem/UserItemReqReceived';
import UserItemReqSent from '@/components/UserItem/UserItemReqSent';
import { ScrollView } from 'react-native-gesture-handler';
import { MyButtonText } from '@/components/MyButton';

const Friends = () => {
  const isFocused = useIsFocused(); // Used to change status bar color
  const [searchText, setSearchText] = useState('');
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
            onPress={() => {}}
            containerStyle={styles.button}
            textStyle={TextStyles.h4}
          />
        </View>
      </View>
      <ScrollView style={{ flex: 1 }}>
        <View style={styles.contentContainer}>
          <Accordion heading="(2) Requests Sent">
            {Array.from({ length: 2 }, (_, index) => (
              <UserItemReqSent
                key={index}
                id={index.toString()}
                username="johndoe"
                displayName="John Doe"
                onlineStatus="online"
              />
            ))}
          </Accordion>
          <Accordion heading="(2) Requests Received">
            {Array.from({ length: 2 }, (_, index) => (
              <UserItemReqReceived
                key={index}
                id={index.toString()}
                username="johndoe"
                displayName="John Doe"
                onlineStatus="online"
              />
            ))}
          </Accordion>
          <Accordion heading="(8) All" defaultOpen>
            {Array.from({ length: 8 }, (_, index) => (
              <UserItemReqReceived
                key={index}
                id={index.toString()}
                username="johndoe"
                displayName="John Doe"
                onlineStatus="online"
                statusText="Hey there! I am using Discord."
              />
            ))}
          </Accordion>
        </View>
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
