import { FlatList, StyleSheet, Text, View } from 'react-native';
import React, { useEffect, useMemo } from 'react';
import { ServerListProps } from '@/types';
import SimpleServerItem from './SimpleServerItem';
import ExtendedServerItem from './ExtendedServerItem';
import Draggable from '../Draggable';
import { useSharedValue } from 'react-native-reanimated';
import useServers from '@/hooks/useServers';

const ExtendedServerList = () => {
  const { servers, selectServer } = useServers();
  const positions = useSharedValue(servers.map((item, index) => index));

  useEffect(() => {
    positions.value = servers.map((item, index) => index);
  }, [servers]);

  return (
    <View style={styles.container}>
      {servers.map((item, index) => (
        <Draggable key={item.id} id={index} positions={positions}>
          <ExtendedServerItem
            {...item}
            onPress={() => {
              selectServer(positions.value[index]);
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
