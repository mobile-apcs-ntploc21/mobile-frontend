import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { useLayoutEffect, useMemo, useState } from 'react';
import { router, useNavigation } from 'expo-router';
import { NativeStackHeaderProps } from '@react-navigation/native-stack';

import MyHeader from '@/components/MyHeader';
import { ScrollView } from 'react-native-gesture-handler';
import GlobalStyles from '@/styles/GlobalStyles';
import ButtonListText from '@/components/ButtonList/ButtonListText';
import BasicModal from '@/components/modal/BasicModal';
import MyText from '@/components/MyText';
import { colors } from '@/constants/theme';
import useServers from '@/hooks/useServers';
import { useAuth } from '@/context/AuthProvider';
import { showAlert } from '@/services/alert';
import { deleteData } from '@/utils/api';
import useServer from '@/hooks/useServer';

const Settings = () => {
  const navigation = useNavigation();
  const { permissions } = useServer();
  const [leaveModalVisible, setLeaveModalVisible] = useState(false);
  const { servers, currentServerId, dispatch } = useServers();
  const { unsubscribeServer } = useServer();
  const { user } = useAuth();

  const thisServer = useMemo(
    () => servers.find((server) => server.id === currentServerId),
    [servers, currentServerId]
  );

  const generalActions = useMemo(
    () => [
      {
        text: 'Overview',
        onPress: () => router.navigate('./overview'),
        isHidden: !permissions['MANAGE_SERVER']
      },
      {
        text: 'Channels',
        onPress: () => router.navigate('./channels'),
        isHidden: !permissions['MANAGE_CHANNEL']
      },
      {
        text: 'Emoji',
        onPress: () => router.navigate('./emoji'),
        isHidden:
          !permissions['CREATE_EXPRESSION'] && !permissions['MANAGE_EXPRESSION']
      },
      {
        text: 'Invite code',
        onPress: () => {}
      }
    ],
    []
  );

  const memberActions = useMemo(
    () => [
      {
        text: 'Members',
        onPress: () => router.navigate('./members')
      },
      {
        text: 'Roles',
        onPress: () => router.navigate('./roles')
      },
      {
        text: 'Bans',
        onPress: () => router.navigate('./bans')
      }
    ],
    []
  );

  const userSettingsActions = useMemo(() => {
    const actions = [];

    if (thisServer?.owner_id !== user?.id) {
      actions.push({
        text: 'Leave Server',
        style: { color: colors.semantic_red },
        onPress: () => setLeaveModalVisible(true)
      });
    }

    return actions;
  }, []);

  useLayoutEffect(() => {
    navigation.setOptions({
      header: (props: NativeStackHeaderProps) => (
        <MyHeader {...props} title="Server Settings" />
      )
    });
  }, []);

  const handleLeave = async () => {
    // Check if user is the owner. If so, request owner to transfer ownership
    // Otherwise, leave the server

    if (thisServer?.owner_id === user?.id) {
      showAlert(
        "You're the owner of this server. Please transfer ownership before leaving."
      );
      return;
    }

    // Leave server
    try {
      const response = await deleteData(
        `/api/v1/servers/${currentServerId}/left`
      );

      if (!response) {
        throw new Error('Failed to leave server');
      }

      // Unsubscribe from server and delete server data
      unsubscribeServer(currentServerId as string);

      // Update servers list
      const newServers = servers.filter(
        (server) => server.id !== currentServerId
      );
      dispatch({ type: 'SET_SERVERS', payload: newServers });

      // Leave server
      router.canGoBack() && router.back();
    } catch (error) {
      console.error(error);
      throw new Error('Failed to leave server');
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ gap: 16 }}>
      <BasicModal
        visible={leaveModalVisible}
        onClose={() => setLeaveModalVisible(false)}
        title="Leave Server"
        onConfirm={handleLeave}
      >
        <MyText>{`Are you sure you want to leave the server?`}</MyText>
      </BasicModal>

      <ButtonListText heading="General" items={generalActions} />
      <ButtonListText heading="Member Management" items={memberActions} />
      <ButtonListText items={userSettingsActions} />
    </ScrollView>
  );
};

export default Settings;

const styles = StyleSheet.create({
  container: {
    ...GlobalStyles.container,
    paddingTop: 16
  }
});
