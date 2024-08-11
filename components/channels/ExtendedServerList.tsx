import { FlatList, StyleSheet, Text, View } from 'react-native';
import React, { useEffect, useMemo } from 'react';
import { ServerListProps } from '@/types';
import SimpleServerItem from './SimpleServerItem';
import ExtendedServerItem from './ExtendedServerItem';
import Draggable from '../Draggable';
import { useSharedValue } from 'react-native-reanimated';
import useServers from '@/hooks/useServers';

interface ExtendedServerListProps {
  swipeDown: () => void;
}

const ExtendedServerList = ({ swipeDown }: ExtendedServerListProps) => {
  const { servers, selectServer, setServers } = useServers();
  const positions = useSharedValue(servers.map((item, index) => index));

  useEffect(() => {
    positions.value = servers.map((item, index) => index);
  }, [servers]);

  useEffect(
    () => () => {
      const newServers = [...servers];

      positions.value.forEach((position, index) => {
        newServers[position] = servers[index];
      });

      setServers(newServers);
    },
    []
  );

  return (
    <View style={styles.container}>
      {servers.map((item, index) => (
        <Draggable key={item.id} id={index} positions={positions}>
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
  );
};

export default ExtendedServerList;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: -16,
    marginHorizontal: 16
  }
});
