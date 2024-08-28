import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import React, { useEffect, useMemo, useState } from 'react';
import { ServerListProps } from '@/types';
import SimpleServerItem from './SimpleServerItem';
import ExtendedServerItem from './ExtendedServerItem';
import Draggable from '../Draggable';
import { useAnimatedReaction, useSharedValue } from 'react-native-reanimated';
import useServers from '@/hooks/useServers';
import { colors, fonts } from '@/constants/theme';
import { FontAwesome5 } from '@expo/vector-icons';
import MyText from '../MyText';
import { template } from '@babel/core';
import { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { COL, HEIGHT, MARGIN_X, MARGIN_Y, WIDTH } from '@/utils/dragging';
import CreateServerModal from '../modal/CreateServerModal';
import { putData } from '@/utils/api';

interface ExtendedServerListProps {
  swipeDown: () => void;
}

const ExtendedServerList = ({ swipeDown }: ExtendedServerListProps) => {
  const { servers, selectServer, setServers } = useServers();
  const positions = useSharedValue<number[]>([]);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const filteredServers = servers.filter((server) =>
      isFavorite ? server.is_favorite : true
    );

    const tmp = filteredServers.map((item, index) => index + 1);
    tmp.unshift(0);
    positions.value = tmp;
  }, [servers, isFavorite]);

  useEffect(
    () => () => {
      const newServers = [...servers];

      positions.value.forEach((position, index) => {
        if (index > 0) newServers[position - 1] = servers[index - 1];
      });

    setServers(newServers, true);
  }, [isFavorite]);

  // This useEffect will save the server positions to AsyncStorage.
  // It will run when the component is unmounted.
  useEffect(() => {
    if (isFavorite) return; // Do not save server positions if isFavorite is true

    return () => {
      // Save the server positions to Database
      const newServers = [...servers];
      positions.value.forEach((position, index) => {
        if (index > 0) newServers[position - 1] = servers[index - 1];
      });

      // Save the new server positions to ServerProvider
      setServers(newServers, true);

      // Compile array of { _id, id }
      const serverPositions = newServers.map((server, index) => ({
        server_id: server._id,
        position: index
      }));

      const saveServerPositions = async () => {
        try {
          const response = await putData('/api/v1/servers/move', {
            servers: serverPositions
          });

          if (!response) {
            throw new Error('Failed to save server positions.');
          }

          console.log('Server positions saved successfully.');
        } catch (err: any) {
          console.error(err);
        }
      };

      saveServerPositions();
    };
  }, []);

  const handleCloseModal = (isWithNewServer?: boolean) => {
    setShowModal(false);
    if (isWithNewServer) swipeDown();
  };

  return (
    <BottomSheetScrollView
      style={styles.container}
      contentContainerStyle={{
        alignItems: 'center'
      }}
      nestedScrollEnabled
    >
      <CreateServerModal visible={showModal} onClose={handleCloseModal} />
      <View
        style={{
          height: Math.ceil(servers.length / COL) * (HEIGHT + MARGIN_Y),
          paddingBottom: MARGIN_Y
        }}
      />
      <View
        style={{
          position: 'absolute',
          width: COL * (WIDTH + MARGIN_X) + MARGIN_X
        }}
      >
        <Draggable key={'create-server'} id={0} positions={positions}>
          <TouchableOpacity
            style={styles.btnContainer}
            onPress={() => setShowModal(true)}
          >
            <View style={styles.btnAdd}>
              <FontAwesome5 name="plus" size={28} color={colors.primary} />
            </View>
            <MyText
              style={styles.textBtn}
              numberOfLines={2}
              ellipsizeMode="tail"
            >
              Create Server
            </MyText>
          </TouchableOpacity>
        </Draggable>
        {servers.map((item, index) => (
          <Draggable key={item.id} id={index + 1} positions={positions}>
            <ExtendedServerItem
              {...item}
              onPress={() => {
                selectServer(item.id);
                swipeDown();
              }}
            />
          </Draggable>
        ))}
      </View>
    </BottomSheetScrollView>
  );
};

export default ExtendedServerList;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: -16,
    marginBottom: 16
  },
  btnAdd: {
    width: 64,
    height: 64,
    borderRadius: 64 / 2,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: colors.primary,
    borderStyle: 'dashed'
  },
  textBtn: {
    alignSelf: 'center',
    fontSize: 12,
    fontFamily: fonts.bold
  },
  btnContainer: {
    gap: 8,
    width: 64
  }
});
