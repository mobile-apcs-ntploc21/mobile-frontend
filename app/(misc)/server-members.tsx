import { FlatList, StyleSheet, Text, View } from 'react-native';
import React, { useCallback, useLayoutEffect, useRef } from 'react';
import { router, useNavigation } from 'expo-router';
import MyHeader from '@/components/MyHeader';
import { NativeStackHeaderProps } from '@react-navigation/native-stack';
import GlobalStyles from '@/styles/GlobalStyles';
import ButtonListBase from '@/components/ButtonList/ButtonListBase';
import Avatar from '@/components/Avatar';
import { StatusType } from '@/types/user_status';
import { colors, fonts } from '@/constants/theme';
import { BottomSheetModal, BottomSheetScrollView } from '@gorhom/bottom-sheet';
import MyBottomSheetModal from '@/components/modal/MyBottomSheetModal';
import ButtonListText from '@/components/ButtonList/ButtonListText';
import { ScrollView } from 'react-native-gesture-handler';

const Item = (props: { user: any }) => {
  const [statusText, setStatusText] = React.useState('');
  return (
    <View style={styles.item}>
      <Avatar
        id={props.user.id}
        showStatus
        setStatusText={setStatusText}
        // subscribeToStatus
      />
      <View style={styles.userInfo}>
        <Text style={styles.username}>User {props.user.id}</Text>
        <Text style={styles.status}>{statusText}</Text>
      </View>
    </View>
  );
};

const ServerMembers = () => {
  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({
      header: (props: NativeStackHeaderProps) => (
        <MyHeader {...props} title="All Members" />
      )
    });
  }, []);

  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  const handleOpenBottomSheet = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, [bottomSheetModalRef]);

  const handleCloseBottomSheet = useCallback(() => {
    bottomSheetModalRef.current?.dismiss();
  }, [bottomSheetModalRef]);

  const [modalUser, setModalUser] = React.useState<any>(null);

  return (
    <View style={GlobalStyles.screenGray}>
      <MyBottomSheetModal
        ref={bottomSheetModalRef}
        onClose={handleCloseBottomSheet}
        heading={modalUser?.username}
      >
        <View style={styles.bottomSheetContainer}>
          <View style={styles.rolesContainer}>
            <Text style={styles.rolesText}>Roles</Text>
            <ScrollView
              horizontal
              contentContainerStyle={styles.roles}
              showsHorizontalScrollIndicator={false}
            >
              {Array.from({ length: 10 }, (_, i) => (
                <View key={i} style={styles.roleItem}>
                  <View
                    style={{
                      ...styles.roleDot,
                      backgroundColor: i % 2 === 0 ? 'red' : 'blue'
                    }}
                  />
                  <Text style={styles.roleTitle}>Role {i}</Text>
                </View>
              ))}
            </ScrollView>
          </View>
          <ButtonListText
            items={[
              {
                text: 'View Profile',
                onPress: () => {
                  handleCloseBottomSheet();
                  router.navigate(`/user/${modalUser.id}`);
                }
              },
              {
                text: 'Edit Member',
                onPress: () => {
                  handleCloseBottomSheet();
                }
              }
            ]}
          />
        </View>
      </MyBottomSheetModal>
      <ScrollView contentContainerStyle={{ padding: 16, gap: 16 }}>
        <ButtonListBase
          heading={'(5) Online'}
          items={Array.from({ length: 5 }, (_, i) => ({
            itemComponent: (
              <Item user={{ id: i.toString(), username: 'User ' + i }} />
            ),
            onPress: () => {
              setModalUser({
                id: i.toString(),
                username: 'User ' + i
              });
              handleOpenBottomSheet();
            }
          }))}
        />
        <ButtonListBase
          heading={'(5) Offline'}
          items={Array.from({ length: 5 }, (_, i) => ({
            itemComponent: (
              <Item user={{ id: i.toString(), username: 'User ' + i }} />
            ),
            onPress: () => {
              setModalUser({
                id: i.toString(),
                username: 'User ' + i
              });
              handleOpenBottomSheet();
            }
          }))}
        />
      </ScrollView>
    </View>
  );
};

export default ServerMembers;

const styles = StyleSheet.create({
  item: {
    width: '100%',
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center'
  },
  userInfo: {
    gap: 4
  },
  username: {
    fontSize: 12,
    fontFamily: fonts.bold,
    lineHeight: 16,
    color: colors.black
  },
  status: {
    fontSize: 10,
    fontFamily: fonts.regular,
    lineHeight: 14,
    color: colors.gray02
  },
  bottomSheetContainer: {
    gap: 16,
    width: '100%'
  },
  rolesContainer: {
    width: '100%',
    gap: 4
  },
  roles: {
    gap: 8,
    flexDirection: 'row'
  },
  rolesText: {
    fontSize: 14,
    fontFamily: fonts.bold,
    color: colors.black,
    marginLeft: 8
  },
  roleItem: {
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    alignItems: 'center',
    backgroundColor: colors.gray04,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.gray02
  },
  roleDot: {
    width: 8,
    height: 8,
    borderRadius: 4
  },
  roleTitle: {
    fontSize: 12,
    fontFamily: fonts.regular,
    color: colors.black
  }
});
