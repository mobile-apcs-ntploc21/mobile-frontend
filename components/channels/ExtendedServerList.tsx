import { FlatList, StyleSheet, Text, View } from 'react-native';
import React, { useEffect, useMemo } from 'react';
import { ServerListProps } from '@/types';
import SimpleServerItem from './SimpleServerItem';
import ExtendedServerItem from './ExtendedServerItem';
import Draggable from '../Draggable';
import { useSharedValue } from 'react-native-reanimated';

interface ExtendedServerListProps extends ServerListProps {}

const ExtendedServerList = (props: ExtendedServerListProps) => {
  const positions = useSharedValue(props.servers.map((item, index) => index));

  useEffect(() => {
    positions.value = props.servers.map((item, index) => index);
  }, [props.servers]);

  return (
    <View style={styles.container}>
      {props.servers.map((item, index) => (
        <Draggable key={item.id} id={index} positions={positions}>
          <ExtendedServerItem {...item} />
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
